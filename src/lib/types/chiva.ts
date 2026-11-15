export type ChivaStatus = 'available' | 'maintenance' | 'retired'

export interface Chiva {
  id: string
  name: string
  description: string
  capacity: number
  imageUrls: string[]
  pricePerHour: number
  status: ChivaStatus
  features: string[]
}

export type ChivaListItem = Pick<
  Chiva,
  'id' | 'name' | 'description' | 'capacity' | 'pricePerHour' | 'status' | 'imageUrls' | 'features'
>

export interface CreateChivaDto {
  name: string
  description: string
  capacity: number
  pricePerHour: number
  features: string[]
  status: ChivaStatus
  imageUrls: string[]
}

export type UpdateChivaDto = Partial<CreateChivaDto>

export interface UploadSignatureResponse {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  allowedFormats: string[]
  maxFileSize: number
}
