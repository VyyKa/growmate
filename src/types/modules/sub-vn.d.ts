declare module "sub-vn" {
  export interface Province {
    name: string
    code: string
    division_type: string
    codename: string
    phone_code: number
  }

  export interface District {
    name: string
    code: string
    division_type: string
    codename: string
    province_code: string
  }

  export interface Ward {
    name: string
    code: string
    division_type: string
    codename: string
    district_code: string
  }

  export function getProvinces(): Province[]
  export function getDistrictsByProvinceCode(provinceCode: string): District[]
  export function getWardsByDistrictCode(districtCode: string): Ward[]
}
