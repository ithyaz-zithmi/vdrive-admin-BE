import request from 'supertest';
import app from '../../app';

describe('Hotspots Endpoints', () => {
  describe('GET /api/hotspots', () => {
    it('should retrieve all hotspots with pagination', async () => {
      const response = await request(app).get('/api/hotspots?page=1&limit=10').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Hotspots fetched successfully');
      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('total');
    });

    it('should support search filtering', async () => {
      const response = await request(app).get('/api/hotspots?search=rush').expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/hotspots/:hotspot_id', () => {
    it('should retrieve specific hotspot by ID', async () => {
      const validId = 'test-hotspot-123';

      const response = await request(app).get(`/api/hotspots/${validId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Hotspot fetched successfully');
    });

    it('should handle invalid hotspot ID', async () => {
      const response = await request(app).get('/api/hotspots/invalid-id').expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/hotspots - Create Hotspot', () => {
    let authToken: string;

    beforeAll(async () => {
      // Get authentication token
      const signInResponse = await request(app).post('/api/auth/signin').send({
        user_name: 'admin@example.com',
        password: 'Admin123!@#',
      });

      if (signInResponse.status === 200 && signInResponse.body.data?.accessToken) {
        authToken = signInResponse.body.data.accessToken;
      }
    });

    it('should create new hotspot with authentication', async () => {
      const hotspotData = {
        id: 'TEST123',
        hotspot_name: 'Test Zone',
        fare: 45.0,
        multiplier: 1.3,
      };

      const response = await request(app)
        .post('/api/hotspots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(hotspotData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Hotspot added successfully');
      expect(response.body.data.hotspot_name).toBe('Test Zone');
      expect(response.body.data.id).toBe('TEST123');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/hotspots')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hotspot_name: 'Test' }) // Missing required fields
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject creation without authentication', async () => {
      const response = await request(app)
        .post('/api/hotspots')
        .send({
          id: 'UNAUTH123',
          hotspot_name: 'Unauthorized Test',
          fare: 50.0,
          multiplier: 1.2,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  // DELETE tests would go here if we had proper test data setup
});
