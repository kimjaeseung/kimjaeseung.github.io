import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PhotoRestorer from '../components/PhotoRestorer'

const STORAGE_KEY = 'echo-photo-demo'
interface PhotoDemoStorage {
  imageData: string
  uploadedAt: string
}

export default function PhotoDemo() {
  const [, setStored] = useLocalStorage<PhotoDemoStorage | null>(STORAGE_KEY, null)

  const handleUploadComplete = (dataUrl: string) => {
    setStored({ imageData: dataUrl, uploadedAt: new Date().toISOString() })
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/preview" className="text-espresso font-ui text-sm hover:text-gold transition-colors" aria-label="돌아가기">
          ← 돌아가기
        </Link>
        <h1 className="font-heading font-semibold text-charcoal">사진 복원 체험</h1>
      </div>

      <p className="text-charcoal font-body mb-8">오래된 사진에 새 생명을 불어넣어 보세요</p>

      <PhotoRestorer onUploadComplete={handleUploadComplete} />
    </div>
  )
}
