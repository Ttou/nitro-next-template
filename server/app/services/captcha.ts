import { createCanvas } from '@napi-rs/canvas'
import { Injectable } from '@nestjs/common'
import { toLower } from 'es-toolkit/compat'
import { generateId } from '~shared/utils'
import { CacheService } from './cache'

@Injectable()
export class CaptchaService {
  private readonly captchaKey = 'captcha:'

  constructor(
    private readonly cacheService: CacheService,
  ) {}

  async image() {
    const canvas = createCanvas(120, 40)
    const ctx = canvas.getContext('2d')

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 生成随机字符
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let captchaValue = ''
    for (let i = 0; i < 5; i++) {
      captchaValue += chars[Math.floor(Math.random() * chars.length)]
    }

    // 设置背景颜色
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 设置字体样式
    ctx.font = '30px Arial'
    ctx.fillStyle = '#000'

    // 在画布上绘制验证码文本
    ctx.fillText(captchaValue, 10, 35)

    // 添加一些干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }

    // 添加一些干扰点
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI)
      ctx.fill()
    }

    const captchaId = generateId()

    await this.save(captchaId, captchaValue)

    return {
      captchaId,
      captchaImage: canvas.toDataURL('image/png'),
    }
  }

  async formula() {
    const canvas = createCanvas(120, 40)
    const ctx = canvas.getContext('2d')

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 生成随机的数学表达式
    const num1 = Math.floor(Math.random() * 10)
    const num2 = Math.floor(Math.random() * 10)
    const operators = ['+', '-', '*']
    const operator = operators[Math.floor(Math.random() * operators.length)]

    // 计算表达式的结果
    let captchaValue: number
    switch (operator) {
      case '+':
        captchaValue = num1 + num2
        break
      case '-':
        captchaValue = num1 - num2
        break
      case '*':
        captchaValue = num1 * num2
        break
    }

    // 绘制表达式
    const expression = `${num1} ${operator} ${num2} = ?`

    // 设置字体样式
    ctx.font = '20px Arial'
    ctx.fillStyle = '#000'

    // 对每个字符进行形变处理
    let x = 10 // 起始 x 坐标
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i]

      // 随机旋转角度（-15° 到 15°）
      const rotateAngle = (Math.random() * 30 - 15) * Math.PI / 180

      // 随机缩放比例（0.8 到 1.2）
      const scaleX = Math.random() * 0.4 + 0.8
      const scaleY = Math.random() * 0.4 + 0.8

      // 随机 y 偏移（-5 到 5）
      const yOffset = Math.random() * 10 - 5

      // 保存当前画布状态
      ctx.save()

      // 移动并旋转画布
      ctx.translate(x, 30 + yOffset)
      ctx.rotate(rotateAngle)
      ctx.scale(scaleX, scaleY)

      // 绘制字符
      ctx.fillText(char, 0, 0)

      // 恢复画布状态
      ctx.restore()

      // 更新 x 坐标
      x += ctx.measureText(char).width * scaleX + 2 // 增加字符间距
    }

    // 添加一些干扰线
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
      ctx.stroke()
    }

    // 添加一些随机点
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1)
    }

    const captchaId = generateId()

    await this.save(captchaId, captchaValue)

    return {
      captchaId,
      captchaImage: canvas.toDataURL('image/png'),
    }
  }

  async verify(captchaId: string, captchaValue: string | number, caseSensitive = false) {
    const cacheKey = this.getCacheKey(captchaId)
    const cacheCaptchaValue = await this.cacheService.get(cacheKey)

    if (!cacheCaptchaValue) {
      return false
    }

    if (caseSensitive) {
      if (cacheCaptchaValue !== captchaValue) {
        return false
      }
    }
    else {
      if (toLower(`${cacheCaptchaValue}`) !== toLower(`${captchaValue}`)) {
        return false
      }
    }

    await this.cacheService.delete(cacheKey)

    return true
  }

  private async save(captchaId: string, captchaValue: string | number) {
    await this.cacheService.set(this.getCacheKey(captchaId), captchaValue, '3m')
  }

  private getCacheKey(captchaId: string) {
    return this.captchaKey + captchaId
  }
}
