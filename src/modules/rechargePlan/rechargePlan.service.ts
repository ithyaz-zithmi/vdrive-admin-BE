import { RechargePlanRepository } from './rechargePlan.repository';

export const RechargePlanService = {

  async getPlans(page = 1, limit = 10) {
    return RechargePlanRepository.getPlans(page, limit);
  },

  async getPlanById(id: number) {
    return RechargePlanRepository.getById(id);
  },

 
  async createPlan(data: any) {
    const isActive = data.isActive ?? true;

    if (isActive === true) {
      const activeCount = await RechargePlanRepository.countActivePlans();

      if (activeCount >= 5) {
        throw new Error('Only 5 plans can be active at a time');
      }
    }

    return RechargePlanRepository.create(data);
  },

  // 🔥 UPDATE – active limit check
  async updatePlan(id: number, data: any) {
    if (data.isActive === true) {
      const activeCount = await RechargePlanRepository.countActivePlans();

      if (activeCount >= 5) {
        throw new Error('Only 5 plans can be active at a time');
      }
    }

    return RechargePlanRepository.update(id, data);
  },

  // 🔥 TOGGLE – active limit check
  async toggleStatus(id: number, status: boolean) {
    if (status === true) {
      const activeCount = await RechargePlanRepository.countActivePlans();

      if (activeCount >= 5) {
        throw new Error('Only 5 plans can be active at a time');
      }
    }

    return RechargePlanRepository.toggle(id, status);
  },

  async deletePlan(id: number) {
    return RechargePlanRepository.delete(id);
  },
};
