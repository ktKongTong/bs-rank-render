
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import zh from 'dayjs/locale/zh-cn'

export const formatTime = (time: string) => {
    dayjs.extend(relativeTime)
    return dayjs(time).locale(zh).fromNow()
}


export const formatNumber = (number: number) => {
    // 1.11w
    try {
        if (number > 10000) {
            return `${(number/10000.0).toFixed(2)}w`
        }
        // 1.11k
        if (number > 1000) {
            return `${(number/1000.0).toFixed(2)}k`
        }
        return number.toString()
    }catch(e) {
        return "0"
    }

}