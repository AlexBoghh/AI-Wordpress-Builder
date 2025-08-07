"use client"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onDataLoaded: (data: Record<string, string>[]) => void
  onError: (error: string) => void
}

export function FileUpload({ onDataLoaded, onError }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const processCSV = useCallback((file: File) => {
    setIsProcessing(true)
    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsProcessing(false)
        
        if (results.errors.length > 0) {
          onError(`CSV parsing error: ${results.errors[0].message}`)
          return
        }

        const requiredColumns = ['title', 'slug']
        const columns = Object.keys(results.data[0] || {})
        const missingColumns = requiredColumns.filter(col => !columns.includes(col))

        if (missingColumns.length > 0) {
          onError(`Missing required columns: ${missingColumns.join(', ')}`)
          return
        }

        onDataLoaded(results.data as Record<string, string>[])
      },
      error: (error) => {
        setIsProcessing(false)
        onError(`Failed to read file: ${error.message}`)
      }
    })
  }, [onDataLoaded, onError])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processCSV(acceptedFiles[0])
    } else {
      onError('Please upload a valid CSV file (max 10MB)')
    }
  }, [processCSV, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          "hover:border-primary hover:bg-accent/50",
          isDragActive && "border-primary bg-accent/50",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        
        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Processing {fileName}...</p>
            </>
          ) : isDragActive ? (
            <>
              <Upload className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Drop your CSV file here</p>
            </>
          ) : fileName ? (
            <>
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground mt-1">Click or drag to replace</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">CSV files only (max 10MB)</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        <p className="font-medium mb-1">Expected CSV columns:</p>
        <code className="bg-muted px-2 py-1 rounded text-xs">
          title, slug, menu, submenu, meta_description, keywords, content_type, priority
        </code>
      </div>
    </div>
  )
}