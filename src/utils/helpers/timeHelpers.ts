
/**
 * Định dạng số giây thành chuỗi mm:ss
 * @param seconds Số giây
 * @returns Chuỗi thời gian dạng mm:ss
 */
export function formatTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${minutes}:${secs.toString().padStart(2, "0")}`
}

/**
 * Lấy thời gian hiện tại ở Việt Nam (GMT+7)
 * @returns Đối tượng Date ở múi giờ Việt Nam
 */
export function getVietnamTime(): Date {
	const now = new Date()
	// Chuyển sang GMT+7
	const utc = now.getTime() + now.getTimezoneOffset() * 60000
	return new Date(utc + 7 * 3600000)
}

/**
 * Định dạng ngày/tháng/năm theo chuẩn Việt Nam (dd/MM/yyyy)
 * @param date Đối tượng Date
 * @returns Chuỗi ngày dạng dd/MM/yyyy
 */
export function formatVietnamDate(date: Date): string {
	const d = date.getDate().toString().padStart(2, "0")
	const m = (date.getMonth() + 1).toString().padStart(2, "0")
	const y = date.getFullYear()
	return `${d}/${m}/${y}`
}

/**
 * Định dạng ngày/tháng/năm và giờ phút theo chuẩn Việt Nam (dd/MM/yyyy HH:mm)
 * @param date Đối tượng Date
 * @returns Chuỗi ngày giờ dạng dd/MM/yyyy HH:mm
 */
export function formatVietnamDateTime(date: Date): string {
	const dateStr = formatVietnamDate(date)
	const h = date.getHours().toString().padStart(2, "0")
	const min = date.getMinutes().toString().padStart(2, "0")
	return `${dateStr} ${h}:${min}`
}

/**
 * Chuyển chuỗi ISO sang Date ở múi giờ Việt Nam
 * @param isoString Chuỗi ISO
 * @returns Đối tượng Date ở GMT+7
 */
export function parseVietnamDate(isoString: string): Date {
	const date = new Date(isoString)
	// Chuyển sang GMT+7
	const utc = date.getTime() + date.getTimezoneOffset() * 60000
	return new Date(utc + 7 * 3600000)
}

export function getTimePeriodInSeconds(seconds: number, minutes: number, hours: number, days: number): number {
	return seconds + minutes * 60 + hours * 3600 + days * 86400;
}
