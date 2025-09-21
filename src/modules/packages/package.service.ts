// src/modules/packages/package.service.ts
import { PackageRepository } from './package.repository';
import { Package } from './package.model';

export const PackageService = {
  async getPackages(page: number, limit: number): Promise<{ data: Package[]; total: number }> {
    return await PackageRepository.getPackages(page, limit);
  },

  async getPackageById(id: string): Promise<Package> {
    const packageItem = await PackageRepository.findById(id);
    if (!packageItem) {
      throw { statusCode: 404, message: 'Package not found' };
    }
    return packageItem;
  },

  async createPackage(data: {
    package_name: string;
    duration_minutes: number;
    distance_km: number;
    extra_distance_km: number;
    extra_minutes: number;
  }): Promise<Package> {
    // Validate fields
    if (!data.package_name || data.package_name.trim().length === 0) {
      throw { statusCode: 400, message: 'package_name cannot be empty' };
    }
    if (data.duration_minutes < 0) {
      throw { statusCode: 400, message: 'duration_minutes cannot be negative' };
    }
    if (data.distance_km < 0) {
      throw { statusCode: 400, message: 'distance_km cannot be negative' };
    }
    if (data.extra_distance_km < 0) {
      throw { statusCode: 400, message: 'extra_distance_km cannot be negative' };
    }
    if (data.extra_minutes < 0) {
      throw { statusCode: 400, message: 'extra_minutes cannot be negative' };
    }

    return await PackageRepository.createPackage(data);
  },

  async updatePackage(
    id: string,
    data: {
      package_name?: string;
      duration_minutes?: number;
      distance_km?: number;
      extra_distance_km?: number;
      extra_minutes?: number;
    }
  ): Promise<Package> {
    // Check if package exists
    const existing = await PackageRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Package not found' };
    }

    // Validate provided fields
    if (
      data.package_name !== undefined &&
      (!data.package_name || data.package_name.trim().length === 0)
    ) {
      throw { statusCode: 400, message: 'package_name cannot be empty' };
    }
    if (data.duration_minutes !== undefined && data.duration_minutes < 0) {
      throw { statusCode: 400, message: 'duration_minutes cannot be negative' };
    }
    if (data.distance_km !== undefined && data.distance_km < 0) {
      throw { statusCode: 400, message: 'distance_km cannot be negative' };
    }
    if (data.extra_distance_km !== undefined && data.extra_distance_km < 0) {
      throw { statusCode: 400, message: 'extra_distance_km cannot be negative' };
    }
    if (data.extra_minutes !== undefined && data.extra_minutes < 0) {
      throw { statusCode: 400, message: 'extra_minutes cannot be negative' };
    }

    return await PackageRepository.updatePackage(id, data);
  },

  async deletePackage(id: string): Promise<void> {
    // Check if package exists (will throw if not found)
    const existing = await PackageRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Package not found' };
    }

    await PackageRepository.deletePackage(id);
  },
};
