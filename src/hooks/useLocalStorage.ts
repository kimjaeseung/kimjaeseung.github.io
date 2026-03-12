import { useState, useCallback } from 'react'

const QUOTA_EXCEEDED_MSG = '저장 공간이 부족합니다. 오래된 데이터를 삭제해 주세요.'

/**
 * LocalStorage 동기화 훅. 실시간 저장/불러오기.
 * @param key - 저장 키
 * @param defaultValue - 키가 없을 때 사용할 값
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const next = value instanceof Function ? value(stored) : value
        setStored(next)
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          window.alert(QUOTA_EXCEEDED_MSG)
        }
      }
    },
    [key, stored]
  )

  return [stored, setValue]
}
