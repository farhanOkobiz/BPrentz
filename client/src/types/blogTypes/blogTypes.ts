export interface Feature {
  _id: string;
  featureName: string;
}

export interface BlogData {
  _id: string;
  blogTitle: string;
  blogImage: string;
  blogDescription: string;
  slug:string;
  feature: Feature;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogRoot {
  status: string;
  message: string;
  data: BlogData[];
}

export interface FeatureRoot {
  status: string;
  message: string;
  data: Feature[];
}
