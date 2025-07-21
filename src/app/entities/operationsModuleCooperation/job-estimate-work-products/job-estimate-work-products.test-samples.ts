import { IJobEstimateWorkProducts, NewJobEstimateWorkProducts } from './job-estimate-work-products.model';

export const sampleWithRequiredData: IJobEstimateWorkProducts = {
  id: 20430,
};

export const sampleWithPartialData: IJobEstimateWorkProducts = {
  id: 17578,
  unit: 'confusion sarong fearless',
};

export const sampleWithFullData: IJobEstimateWorkProducts = {
  id: 15676,
  workProductName: 'goose',
  quantity: 22929.96,
  unit: 'alive',
  notes: 'hollow',
};

export const sampleWithNewData: NewJobEstimateWorkProducts = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
