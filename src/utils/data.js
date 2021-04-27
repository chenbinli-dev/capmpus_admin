import moment from 'moment'
//传入数组，转为echarts的省份的data
export function countProvinceToEcharts (arr) {
    let data = [
        { value: 0, name: '北京市' },
        { value: 0, name: '广东省' },
        { value: 0, name: '山东省' },
        { value: 0, name: '江苏省' },
        { value: 0, name: '河南省' },
        { value: 0, name: '上海市' },
        { value: 0, name: '河北省' },
        { value: 0, name: '浙江省' },
        { value: 0, name: '香港特别行政区' },
        { value: 0, name: '陕西省' },
        { value: 0, name: '湖南省' },
        { value: 0, name: '重庆市' },
        { value: 0, name: '福建省' },
        { value: 0, name: '天津市' },
        { value: 0, name: '云南省' },
        { value: 0, name: '四川省' },
        { value: 0, name: '广西壮族自治区' },
        { value: 0, name: '安徽省' },
        { value: 0, name: '海南省' },
        { value: 0, name: '江西省' },
        { value: 0, name: '湖北省' },
        { value: 0, name: '山西省' },
        { value: 0, name: '辽宁省' },
        { value: 0, name: '台湾省' },
        { value: 0, name: '黑龙江' },
        { value: 0, name: '内蒙古自治区' },
        { value: 0, name: '澳门特别行政区' },
        { value: 0, name: '贵州省' },
        { value: 0, name: '甘肃省' },
        { value: 0, name: '青海省' },
        { value: 0, name: '新疆维吾尔自治区' },
        { value: 0, name: '西藏区' },
        { value: 0, name: '吉林省' },
        { value: 0, name: '宁夏回族自治区' },
    ]
    arr.forEach(item => {
        switch (item.province) {
            case '北京市':
                data[0].value++
                break
            case '广东省':
                data[1].value++
                break
            case '山东省':
                data[2].value++
                break
            case '江苏省':
                data[3].value++
                break
            case '河南省':
                data[4].value++
                break
            case '上海市':
                data[5].value++
                break
            case '河北省':
                data[6].value++
                break
            case '浙江省':
                data[7].value++
                break
            case '香港特别行政区':
                data[8].value++
                break
            case '陕西省':
                data[9].value++
                break
            case '湖南省':
                data[10].value++
                break
            case '重庆市':
                data[11].value++
                break
            case '福建省':
                data[12].value++
                break
            case '天津市':
                data[13].value++
                break
            case '云南省':
                data[14].value++
                break
            case '四川省':
                data[15].value++
                break
            case '广西壮族自治区':
                data[16].value++
                break
            case '安徽省':
                data[17].value++
                break
            case '海南省':
                data[18].value++
                break
            case '江西省':
                data[19].value++
                break
            case '湖北省':
                data[20].value++
                break
            case '山西省':
                data[21].value++
                break
            case '辽宁省':
                data[22].value++
                break
            case '台湾省':
                data[23].value++
                break
            case '黑龙江':
                data[24].value++
                break
            case '内蒙古自治区':
                data[25].value++
                break
            case '澳门特别行政区':
                data[26].value++
                break
            case '贵州省':
                data[27].value++
                break
            case '甘肃省':
                data[28].value++
                break
            case '青海省':
                data[29].value++
                break
            case '新疆维吾尔自治区':
                data[30].value++
                break
            case '西藏区':
                data[31].value++
                break
            case '吉林省':
                data[32].value++
                break
            case '宁夏回族自治区':
                data[33].value++
                break
            default:
                break
        }
    })

    data = data.filter((item) => {
        return item.value !== 0
    })
    return data
}
export function countBackground (arr) {
    let data = [
        { value: 0, name: '大专' },
        { value: 0, name: '本科' },
        { value: 0, name: '硕士研究生' },
        { value: 0, name: '博士研究生' }
    ]
    arr.forEach(item => {
        switch (item.education_background) {
            case '大专':
                data[0].value++
                break
            case '本科':
                data[1].value++
                break
            case '硕士研究生':
                data[2].value++
                break
            case '博士研究生':
                data[3].value++
                break
            default:
                break
        }
    })
    data = data.filter((item) => {
        return item.value !== 0
    })
    return data
}
export function countGender (arr) {
    let data = [
        { value: 0, name: '男' },
        { value: 0, name: '女' },
        { value: 0, name: '未设置' }
    ]
    arr.forEach(item => {
        switch (item.gender) {
            case 100:
                data[0].value++
                break
            case 200:
                data[1].value++
                break
            default:
                data[2].value++
                break
        }
    })
    data = data.filter((item) => {
        return item.value !== 0
    })
    return data
}
export function countType (arr) {
    let data = [
        { value: 0, name: '代取快递' },
        { value: 0, name: '代打印' },
        { value: 0, name: '代购物' },
        { value: 0, name: '其他代跑' }
    ]
    arr.forEach(item => {
        switch (item.type) {
            case '代取快递':
                data[0].value++
                break
            case '代打印':
                data[1].value++
                break
            case '代购物':
                data[2].value++
                break
            case '其他代跑':
                data[3].value++
                break
            default:
                break
        }
    })
    data = data.filter((item) => {
        return item.value !== 0
    })
    return data
}
export function countStatus (arr) {
    let data = [
        { value: 0, name: '闲置' },
        { value: 0, name: '进行中' },
        { value: 0, name: '已完成' },
        { value: 0, name: '过期' },
        { value: 0, name: '超时' }
    ]
    arr.forEach(item => {
        switch (item.status) {
            case 1:
                data[0].value++
                break
            case 2:
                data[1].value++
                break
            case 3:
                data[2].value++
                break
            case 4:
                data[3].value++
                break
            case 5:
                data[4].value++
                break
            default:
                break
        }
    })
    data = data.filter((item) => {
        return item.value !== 0
    })
    return data
}
export function countBalance (arr) {
    let data = [
        { value: 0, name: '充值' },
        { value: 0, name: '提现' },
        { value: 0, name: '任务支出' },
        { value: 0, name: '任务收入' },
        { value: 0, name: '任务返还' }
    ]
    arr.forEach(item => {
        switch (item.type) {
            case 1:
                data[0].value += parseFloat(item.money)
                break
            case 2:
                data[1].value += parseFloat(item.money)
                break
            case 3:
                data[2].value += parseFloat(item.money)
                break
            case 4:
                data[3].value += parseFloat(item.money)
                break
            case 5:
                data[4].value += parseFloat(item.money)
                break
            default:
                break
        }
    })
    data = data.filter((item) => {
        return item.value !== 0
    })
    return data
}
//近七天
export function countRecent (arr, type) {
    let data = [0, 0, 0, 0, 0, 0, 0]
    arr.forEach(item => {
        if (item.type === type) {
            const recordDate = moment(item.createAt).format('YYYY-MM-DD')
            console.log(recordDate)
            switch (recordDate) {
                case moment().subtract(1, 'days').format('YYYY-MM-DD'):
                    data[6] += parseFloat(item.money)
                    break
                case moment().subtract(2, 'days').format('YYYY-MM-DD'):
                    data[5] += parseFloat(item.money)
                    break
                case moment().subtract(3, 'days').format('YYYY-MM-DD'):
                    data[4] += parseFloat(item.money)
                    break
                case moment().subtract(4, 'days').format('YYYY-MM-DD'):
                    data[3] += parseFloat(item.money)
                    break
                case moment().subtract(5, 'days').format('YYYY-MM-DD'):
                    data[2] += parseFloat(item.money)
                    break
                case moment().subtract(6, 'days').format('YYYY-MM-DD'):
                    data[1] += parseFloat(item.money)
                    break
                case moment().subtract(7, 'days').format('YYYY-MM-DD'):
                    data[0] += parseFloat(item.money)
                    break
                default:
                    break
            }
        }
    })
    return data
}