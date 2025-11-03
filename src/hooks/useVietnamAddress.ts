import { useMemo } from "react"
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "sub-vn"
import type { SelectOption } from "../components/CustomSelect"

/**
 * Hook để lấy danh sách địa chỉ Việt Nam (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã)
 * Sử dụng package sub-vn
 */
export const useVietnamAddress = () => {
  // Get all provinces
  const provinces = useMemo((): SelectOption[] => {
    const provinceList = getProvinces()
    return provinceList.map((province) => ({
      label: province.name,
      value: province.code,
    }))
  }, [])

  // Get districts by province code
  const getDistrictOptions = (provinceCode: string): SelectOption[] => {
    if (!provinceCode) return []
    const districtList = getDistrictsByProvinceCode(provinceCode)
    return districtList.map((district) => ({
      label: district.name,
      value: district.code,
    }))
  }

  // Get wards by district code
  const getWardOptions = (districtCode: string): SelectOption[] => {
    if (!districtCode) return []
    const wardList = getWardsByDistrictCode(districtCode)
    return wardList.map((ward) => ({
      label: ward.name,
      value: ward.code,
    }))
  }

  return {
    provinces,
    getDistrictOptions,
    getWardOptions,
  }
}
