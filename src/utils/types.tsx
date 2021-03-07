export type NavigationParamList = {
  Home: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ChooseMode: undefined;
  Welcome: undefined;
  PosAndNeg: undefined;
};

export type Obj = {
  exqId: number;
  thumbnail: string;
  shotId?: number;
  folderName?: string;
};

export type State = {
  positives: Obj[];
  negatives: Obj[];
  seen: Obj[];
  images: Obj[];
  loading: boolean;
  mediaInfo: any;
};

export type MediaInfo = {
  folder: Folder;
};

export type Folder = {
  description: string;
  folder: string;
  shots: Obj[];
};
