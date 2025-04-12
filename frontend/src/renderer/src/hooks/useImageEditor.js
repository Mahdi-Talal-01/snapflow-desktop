import { useRef, useState, useEffect } from 'react'

const useImageEditor = (imageUrl) => {
  const canvasRef = useRef(null)
  const [image, setImage] = useState(null)
  const [watermarkText, setWatermarkText] = useState('')
  const [transform, setTransform] = useState({
    rotate: 0,
    flipHorizontal: false,
    flipVertical: false
  })

  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        initializeCanvas(img)
      }
      img.src = imageUrl
    }
  }, [imageUrl])

  const initializeCanvas = (img) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    applyTransforms(ctx, img)
  }

  const applyTransforms = (ctx, img) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.save()
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
    ctx.rotate((transform.rotate * Math.PI) / 180)
    ctx.scale(transform.flipHorizontal ? -1 : 1, transform.flipVertical ? -1 : 1)
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)
    ctx.restore()
  }

  const handleTransform = (type, value) => {
    const newTransform = { ...transform }
    switch (type) {
      case 'rotate':
        newTransform.rotate = (newTransform.rotate + value) % 360
        break
      case 'flipH':
        newTransform.flipHorizontal = !newTransform.flipHorizontal
        break
      case 'flipV':
        newTransform.flipVertical = !newTransform.flipVertical
        break
    }
    setTransform(newTransform)
    if (image) {
      const ctx = canvasRef.current.getContext('2d')
      applyTransforms(ctx, image)
    }
  }

  const applyFilter = (filterName) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    switch (filterName) {
      case 'blackAndWhite':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg
          data[i + 1] = avg
          data[i + 2] = avg
        }
        break
      case 'soft':
        for (let i = 0; i < data.length; i += 4) {
          data[i] *= 0.9
          data[i + 1] *= 0.9
          data[i + 2] *= 1.1
        }
        break
      case 'warm':
        for (let i = 0; i < data.length; i += 4) {
          data[i] *= 1.1
          data[i + 1] *= 1.05
          data[i + 2] *= 0.9
        }
        break
      case 'cool':
        for (let i = 0; i < data.length; i += 4) {
          data[i] *= 0.9
          data[i + 1] *= 0.9
          data[i + 2] *= 1.1
        }
        break
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const addWatermark = () => {
    if (!watermarkText || !canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Redraw the image first
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    applyTransforms(ctx, image) // This re-draws the transformed image

    // Add the watermark
    ctx.font = '24px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText(watermarkText, canvas.width - 20, canvas.height - 20)
  }

  const getImageDataUrl = () => {
    if (!canvasRef.current) return null
    return canvasRef.current.toDataURL('image/jpeg', 0.9)
  }

  return {
    canvasRef,
    transform,
    handleTransform,
    applyFilter,
    addWatermark,
    watermarkText,
    setWatermarkText,
    getImageDataUrl
  }
}

export default useImageEditor
