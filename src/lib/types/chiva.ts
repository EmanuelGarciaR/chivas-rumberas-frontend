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
  'id' | 'name' | 'capacity' | 'pricePerHour' | 'status' | 'imageUrls' | 'features'
>
