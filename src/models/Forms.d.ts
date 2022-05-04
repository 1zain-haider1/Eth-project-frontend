import { UseFormTrigger, FieldErrors } from "react-hook-form";

export type ArtFormValues = {
  nft_name: string;
  nft_description: string;
  world: string;
  collection: string;
  artist: string;
  artist2: string;
  year: number | string;
  point_value: number;
  genre: string;
  about: string;
  preview_file_png: FileList;
  dark_mode: boolean;
  has_audio: boolean;
  fractional_ownership: boolean;
  allow_staking: boolean;
};

export type Skybox = {
  skybox?: string;
};

export type MintFormValues = {
  rarity: Rarity;
  num_mints: number;
};

export type BoxFileUploadValues = {
  preview_file_png: FileList;
  small_front_file: FileList;
  medium_front_file: FileList;
  large_front_file: FileList;
  back_file_png: FileList;
  left_file_png: FileList;
  right_file_png: FileList;
  top_file_png: FileList;
  bottom_file_png: FileList;
};

export type FbxFileUploadValues = {
  file_fbx: FileList;
};

export type GlbFileUploadValues = {
  file_glb: FileList;
};

export type TwoDimensionUploadValues = {
  file_2d: FileList;
};

export type ThreeDFileExtension = "fbx" | "glb";

/**
 * Used to pass to shared upload file components
 */
export type FileUploadValues = BoxFileUploadValues &
  FbxFileUploadValues &
  TwoDimensionUploadValues &
  GlbFileUploadValues;

export type FormValues = BoxFileUploadValues &
  MintFormValues &
  ArtFormValues &
  Skybox;

type FbxFormValues = FbxFileUploadValues &
  MintFormValues &
  ArtFormValues &
  Skybox;

type GlbFormValues = GlbFileUploadValues &
  MintFormValues &
  ArtFormValues &
  Skybox;

type TwoDimensionFormValues = TwoDimensionUploadValues &
  MintFormValues &
  ArtFormValues;

/**
 * These are passed to shared components which need access to errors or triggers
 */
export type FormsErrors =
  | FieldErrors<Partial<FormValues>>
  | FieldErrors<Partial<FbxFormValues>>
  | FieldErrors<Partial<GlbFormValues>>;

export type FormsTriggers =
  | UseFormTrigger<FormValues>
  | UseFormTrigger<FbxFormValues>
  | UseFormTrigger<GlbFormValues>
  | UseFormTrigger<TwoDimensionFormValues>;

/**
 * Required to pass to ArtInformationPanel trigger
 */
type ArtInfoFormValues = Pick<FormValues, keyof ArtFormValues & Skybox>;

export type ValidFileFormats =
  | "video/mp4"
  | "image/png"
  | "application/octet-stream"
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "video/mp4";
