import { query } from '../utils/db.js';
import { getCached, setCached } from '../utils/redis.js';

// Get all districts, optionally filtered by state
export async function getDistricts(req, res, next) {
    try {
        const { state_id } = req.query;
        
        let sql = `
            SELECT d.id, d.name, d.code, d.latitude, d.longitude,
                   s.id as state_id, s.name as state_name, s.code as state_code
            FROM districts d
            JOIN states s ON d.state_id = s.id
        `;
        
        const params = [];
        if (state_id) {
            sql += ' WHERE d.state_id = $1';
            params.push(state_id);
        }
        
        sql += ' ORDER BY s.name, d.name';
        
        const result = await query(sql, params);
        
        res.json({
            count: result.rows.length,
            districts: result.rows
        });
    } catch (error) {
        next(error);
    }
}

// Get latest snapshot for a district
export async function getDistrictLatest(req, res, next) {
    try {
        const { id } = req.params;
        
        // Try cache first
        const cacheKey = `district:${id}:latest`;
        const cached = await getCached(cacheKey);
        if (cached) {
            return res.json({ ...cached, cached: true });
        }
        
        const sql = `
            SELECT s.*, d.name as district_name, d.code as district_code,
                   st.name as state_name, st.code as state_code,
                   s.created_at as data_timestamp
            FROM mgnrega_snapshots s
            JOIN districts d ON s.district_id = d.id
            JOIN states st ON d.state_id = st.id
            WHERE s.district_id = $1
            ORDER BY s.year DESC, s.month DESC
            LIMIT 1
        `;
        
        const result = await query(sql, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No data found for this district' });
        }
        
        const data = {
            ...result.rows[0],
            cached: false
        };
        
        // Cache for 1 hour
        await setCached(cacheKey, data, 3600);
        
        res.json(data);
    } catch (error) {
        next(error);
    }
}

// Get historical data for a district
export async function getDistrictHistory(req, res, next) {
    try {
        const { id } = req.params;
        const months = parseInt(req.query.months) || 12;
        
        // Try cache first
        const cacheKey = `district:${id}:history:${months}`;
        const cached = await getCached(cacheKey);
        if (cached) {
            return res.json({ ...cached, cached: true });
        }
        
        const sql = `
            SELECT s.*, d.name as district_name, d.code as district_code,
                   st.name as state_name, st.code as state_code
            FROM mgnrega_snapshots s
            JOIN districts d ON s.district_id = d.id
            JOIN states st ON d.state_id = st.id
            WHERE s.district_id = $1
            ORDER BY s.year DESC, s.month DESC
            LIMIT $2
        `;
        
        const result = await query(sql, [id, months]);
        
        const data = {
            district_id: id,
            count: result.rows.length,
            history: result.rows,
            cached: false
        };
        
        // Cache for 1 hour
        await setCached(cacheKey, data, 3600);
        
        res.json(data);
    } catch (error) {
        next(error);
    }
}

// Compare district with state average
export async function getDistrictCompare(req, res, next) {
    try {
        const { id } = req.params;
        const { with: compareWith } = req.query;
        
        if (!compareWith || compareWith !== 'state') {
            return res.status(400).json({ error: 'Invalid comparison type. Use ?with=state' });
        }
        
        // Try cache first
        const cacheKey = `district:${id}:compare:state`;
        const cached = await getCached(cacheKey);
        if (cached) {
            return res.json({ ...cached, cached: true });
        }
        
        // Get district data
        const districtSql = `
            SELECT AVG(s.workdays) as avg_workdays,
                   AVG(s.wages_paid) as avg_wages_paid,
                   AVG(s.people_benefited) as avg_people_benefited,
                   AVG(s.payment_delay_days) as avg_payment_delay,
                   COUNT(*) as data_points
            FROM mgnrega_snapshots s
            WHERE s.district_id = $1
            AND s.year >= EXTRACT(YEAR FROM CURRENT_DATE) - 1
        `;
        
        const districtResult = await query(districtSql, [id]);
        
        // Get district name
        const districtInfoSql = `
            SELECT d.name, d.code, st.name as state_name, st.id as state_id
            FROM districts d
            JOIN states st ON d.state_id = st.id
            WHERE d.id = $1
        `;
        const districtInfo = await query(districtInfoSql, [id]);
        
        if (districtInfo.rows.length === 0) {
            return res.status(404).json({ error: 'District not found' });
        }
        
        // Get state average
        const stateId = districtInfo.rows[0].state_id;
        const stateSql = `
            SELECT AVG(s.workdays) as avg_workdays,
                   AVG(s.wages_paid) as avg_wages_paid,
                   AVG(s.people_benefited) as avg_people_benefited,
                   AVG(s.payment_delay_days) as avg_payment_delay,
                   COUNT(*) as data_points
            FROM mgnrega_snapshots s
            JOIN districts d ON s.district_id = d.id
            WHERE d.state_id = $1
            AND s.year >= EXTRACT(YEAR FROM CURRENT_DATE) - 1
        `;
        
        const stateResult = await query(stateSql, [stateId]);
        
        const data = {
            district: {
                ...districtInfo.rows[0],
                ...districtResult.rows[0]
            },
            state: {
                name: districtInfo.rows[0].state_name,
                ...stateResult.rows[0]
            },
            cached: false
        };
        
        // Cache for 1 hour
        await setCached(cacheKey, data, 3600);
        
        res.json(data);
    } catch (error) {
        next(error);
    }
}
