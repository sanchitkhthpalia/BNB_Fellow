import { Pool } from 'pg';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';

dotenv.config();

const dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function importMgnregaData() {
    console.log('Starting MGNREGA data import from CSV...');
    
    try {
        // Clear existing data
        await dbPool.query('DELETE FROM mgnrega_snapshots');
        await dbPool.query('DELETE FROM districts');
        await dbPool.query('DELETE FROM states');
        
        console.log('Cleared existing data');
        
        // Import states first
        const states = new Set();
        const districts = new Map();
        
        // Read CSV file
        const csvFile = 'ee03643a-ee4c-48c2-ac30-9f2ff26ab722_f1cf46288ccab3bb6293098c460f3f6f.csv';
        
        console.log('Reading CSV file...');
        
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFile)
                .pipe(csv())
                .on('data', (row) => {
                    // Collect unique states
                    if (row.state_name && row.state_code) {
                        states.add(JSON.stringify({
                            name: row.state_name,
                            code: row.state_code
                        }));
                    }
                    
                    // Collect unique districts
                    if (row.district_name && row.district_code && row.state_name) {
                        const districtKey = `${row.state_name}-${row.district_name}`;
                        if (!districts.has(districtKey)) {
                            districts.set(districtKey, {
                                name: row.district_name,
                                code: row.district_code,
                                state_name: row.state_name,
                                state_code: row.state_code
                            });
                        }
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });
        
        console.log(`Found ${states.size} states and ${districts.size} districts`);
        
        // Insert states
        const stateMap = new Map();
        for (const stateStr of states) {
            const state = JSON.parse(stateStr);
            const result = await dbPool.query(
                'INSERT INTO states (name, code) VALUES ($1, $2) RETURNING id',
                [state.name, state.code]
            );
            stateMap.set(state.name, result.rows[0].id);
            console.log(`Inserted state: ${state.name}`);
        }
        
        // Insert districts
        const districtMap = new Map();
        for (const [key, district] of districts) {
            const stateId = stateMap.get(district.state_name);
            if (stateId) {
                const result = await dbPool.query(
                    'INSERT INTO districts (state_id, name, code) VALUES ($1, $2, $3) RETURNING id',
                    [stateId, district.name, district.code]
                );
                districtMap.set(key, result.rows[0].id);
                console.log(`Inserted district: ${district.name}, ${district.state_name}`);
            }
        }
        
        // Import snapshots (sample recent data)
        console.log('Importing recent snapshots...');
        
        let snapshotCount = 0;
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFile)
                .pipe(csv())
                .on('data', async (row) => {
                    // Only import recent data (2023-2024)
                    if (row.fin_year && (row.fin_year.includes('2023') || row.fin_year.includes('2024'))) {
                        const districtKey = `${row.state_name}-${row.district_name}`;
                        const districtId = districtMap.get(districtKey);
                        
                        if (districtId && row.Total_Individuals_Worked && row.Wages) {
                            try {
                                // Extract year and month
                                const year = row.fin_year.split('-')[0];
                                const month = getMonthNumber(row.month);
                                
                                if (month && year) {
                                    await dbPool.query(`
                                        INSERT INTO mgnrega_snapshots 
                                        (district_id, year, month, workdays, wages_paid, people_benefited, funds_disbursed, payment_delay_days)
                                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                                        ON CONFLICT (district_id, year, month) DO NOTHING
                                    `, [
                                        districtId,
                                        parseInt(year),
                                        month,
                                        parseInt(row.Total_Households_Worked) || 0,
                                        parseFloat(row.Wages) || 0,
                                        parseInt(row.Total_Individuals_Worked) || 0,
                                        parseFloat(row.Total_Exp) || 0,
                                        Math.max(0, 15 - parseFloat(row.percentage_payments_gererated_within_15_days)) || 15
                                    ]);
                                    
                                    snapshotCount++;
                                    if (snapshotCount % 100 === 0) {
                                        console.log(`Imported ${snapshotCount} snapshots...`);
                                    }
                                }
                            } catch (error) {
                                console.error(`Error importing snapshot: ${error.message}`);
                            }
                        }
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });
        
        console.log(`Import completed! Imported ${snapshotCount} snapshots`);
        
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await dbPool.end();
    }
}

function getMonthNumber(monthName) {
    const months = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    return months[monthName] || null;
}

// Run import
importMgnregaData().catch(console.error);
