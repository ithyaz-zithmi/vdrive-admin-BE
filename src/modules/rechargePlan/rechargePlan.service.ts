import { RechargePlanRepository } from './rechargePlan.repository';
import {
  CreateRechargePlanDTO,
  UpdateRechargePlanDTO,
} from './rechargePlan.repository';

export const RechargePlanService = {

  async getPlans(page = 1, limit = 10) {
    return RechargePlanRepository.getPlans(page, limit);
  },

  async getPlanById(id: number) {
    const plan = await RechargePlanRepository.getById(id);
    if (!plan) {
      throw { statusCode: 404, message: 'Recharge plan not found' };
    }
    return plan;
  },

  async createPlan(data: CreateRechargePlanDTO) {
    const isActive = data.isActive ?? true;

    if (isActive === true) {
      const activeCount = await RechargePlanRepository.countActivePlans();
      if (activeCount >= 5) {
        throw {
          statusCode: 400,
          message: 'Only 5 plans can be active at a time',
        };
      }
    }

    return RechargePlanRepository.create(data);
  },

  async updatePlan(id: number, data: UpdateRechargePlanDTO) {
    if (data.isActive === true) {
      const activeCount = await RechargePlanRepository.countActivePlans();
      if (activeCount >= 5) {
        throw {
          statusCode: 400,
          message: 'Only 5 plans can be active at a time',
        };
      }
    }

    return RechargePlanRepository.update(id, data);
  },

  async toggleStatus(id: number, status: boolean) {
    if (status === true) {
      const activeCount = await RechargePlanRepository.countActivePlans();
      if (activeCount >= 5) {
        throw {
          statusCode: 400,
          message: 'Only 5 plans can be active at a time',
        };
      }
    }

    return RechargePlanRepository.toggle(id, status);
  },

  async deletePlan(id: number) {
    return RechargePlanRepository.delete(id);
  },
};
