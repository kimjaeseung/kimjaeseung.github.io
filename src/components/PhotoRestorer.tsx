import { useState, useRef } from 'react'

const MAX_SIZE = 1024
const MAX_FILE_BYTES = 1024 * 1024

/**
 * 이미지 리사이즈 (1MB 초과 시 Canvas로 축소)
 */
function resizeIfNeeded(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      if (file.size <= MAX_FILE_BYTES) {
        resolve(dataUrl)
        return
      }
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = (height * MAX_SIZE) / width
            width = MAX_SIZE
          } else {
            width = (width * MAX_SIZE) / height
            height = MAX_SIZE
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(dataUrl)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = () => resolve(dataUrl)
      img.src = dataUrl
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

interface PhotoRestorerProps {
  onUploadComplete?: (dataUrl: string) => void
}

export default function PhotoRestorer({ onUploadComplete }: PhotoRestorerProps) {
  const [image, setImage] = useState<string | null>(null)
  const [restored, setRestored] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [compare, setCompare] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return
    try {
      const dataUrl = await resizeIfNeeded(file)
      setImage(dataUrl)
      setRestored(false)
      onUploadComplete?.(dataUrl)
    } catch {
      alert('이미지를 불러올 수 없습니다.')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0] ?? null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null)
  }

  const startRestore = () => {
    if (!image) return
    setLoading(true)
    setProgress(0)
    const steps = [30, 65, 90, 100]
    let i = 0
    const id = setInterval(() => {
      setProgress(steps[i] ?? 100)
      i += 1
      if (i >= steps.length) {
        clearInterval(id)
        setLoading(false)
        setRestored(true)
      }
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {!image ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-sand rounded-xl p-12 text-center cursor-pointer hover:border-gold hover:bg-warm/50 transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="사진을 여기에 놓거나 클릭하여 업로드"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            aria-label="이미지 선택"
          />
          <span className="text-4xl block mb-2">📷</span>
          <p className="text-sand font-body">사진을 여기에 놓거나 클릭하여 업로드</p>
        </div>
      ) : (
        <>
          {loading && (
            <div className="rounded-xl bg-warm border border-sand p-4">
              <p className="text-espresso font-ui text-sm mb-2">AI가 사진을 분석하고 있습니다...</p>
              <div className="h-2 bg-sand/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-sand font-ui mb-2">Before</p>
              <div
                className="rounded-xl overflow-hidden border border-sand photo-before"
                style={{ filter: restored ? 'grayscale(40%) blur(1.5px) sepia(30%) contrast(85%)' : undefined }}
              >
                <img src={image} alt="원본" className="w-full h-auto block" />
              </div>
            </div>
            <div>
              <p className="text-xs text-sand font-ui mb-2">After</p>
              <div
                className="rounded-xl overflow-hidden border border-sand photo-after transition-[filter] duration-[2000ms] ease-in-out"
                style={{
                  filter: restored
                    ? 'grayscale(0%) blur(0px) sepia(0%) contrast(110%) saturate(120%)'
                    : 'grayscale(40%) blur(1.5px) sepia(30%) contrast(85%)',
                }}
              >
                <img src={image} alt="복원" className="w-full h-auto block" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-sand font-ui">비교 슬라이더 (왼쪽: Before ← → After: 오른쪽)</p>
            <div className="relative rounded-xl overflow-hidden border border-sand aspect-video bg-warm">
              <img
                src={image}
                alt="Before"
                className="absolute inset-0 w-full h-full object-contain photo-before transition-none"
                style={{ filter: 'grayscale(40%) blur(1.5px) sepia(30%) contrast(85%)' }}
              />
              <div
                className="absolute inset-0 bg-transparent z-10 transition-none"
                style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}
              >
                <img
                  src={image}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-contain photo-after transition-none"
                  style={{
                    filter: restored
                      ? 'grayscale(0%) blur(0) sepia(0%) contrast(110%) saturate(120%)'
                      : 'grayscale(40%) blur(1.5px) sepia(30%) contrast(85%)',
                  }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={compare}
              onChange={(e) => setCompare(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-sand/30 accent-gold"
              aria-label="Before와 After 비교"
            />
          </div>

          {!restored && !loading && (
            <button
              type="button"
              onClick={startRestore}
              className="w-full py-3 rounded-xl bg-espresso text-cream font-ui font-semibold hover:ring-2 hover:ring-gold/50 transition-all"
              aria-label="AI 복원 시작"
            >
              AI 복원 시작
            </button>
          )}
        </>
      )}
    </div>
  )
}
