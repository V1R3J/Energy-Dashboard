import React, { useState, useEffect, useCallback } from 'react'
import { Upload, Trash2, X, FileImage, Loader2, AlertCircle, LayoutGrid, List, Pencil, Check } from 'lucide-react'
import bg2 from '../assets/bg2.jpg'
import {
  uploadImage,
  getImages,
  getImagePreviewUrl,
  deleteImage,
} from '../lib/actions/file.actions'

const BillArchive = () => {
  const [images, setImages]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [uploading, setUploading]   = useState(false)
  const [error, setError]           = useState(null)
  const [lightbox, setLightbox]     = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [view, setView]             = useState('grid') // 'grid' | 'list'
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const docs = await getImages()
      setImages(docs)
    } catch {
      setError('Failed to load images. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchImages() }, [fetchImages])

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      setError(null)
      await uploadImage(file)
      await fetchImages()
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (doc) => {
    try {
      setDeletingId(doc.$id)
      await deleteImage(doc.$id, doc.fileId)
      setImages((prev) => prev.filter((img) => img.$id !== doc.$id))
      if (lightbox?.$id === doc.$id) setLightbox(null)
    } catch {
      setError('Delete failed. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  // ── Rename ────────────────────────────────────────────────────────────────
  const startRename = (doc) => {
    setRenamingId(doc.$id)
    setRenameValue(doc.name)
  }

  const confirmRename = (doc) => {
    if (renameValue.trim()) {
      setImages((prev) => prev.map((img) => img.$id === doc.$id ? { ...img, name: renameValue.trim() } : img))
    }
    setRenamingId(null)
  }

  // ── Format date ───────────────────────────────────────────────────────────
  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  // ── Card actions (shared between grid & list) ─────────────────────────────
  const CardActions = ({ doc }) => (
    <div className="flex items-center gap-1">
      {/* Rename */}
      {renamingId === doc.$id ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') confirmRename(doc); if (e.key === 'Escape') setRenamingId(null) }}
            className="text-xs border border-gray-300 rounded-md px-2 py-1 w-32 outline-none focus:border-indigo-400"
          />
          <button onClick={() => confirmRename(doc)} className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50">
            <Check size={13} />
          </button>
          <button onClick={() => setRenamingId(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X size={13} />
          </button>
        </div>
      ) : (
        <button onClick={() => startRename(doc)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors" title="Rename">
          <Pencil size={13} />
        </button>
      )}
      {/* Delete */}
      <button onClick={() => handleDelete(doc)} disabled={deletingId === doc.$id} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
        {deletingId === doc.$id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
      </button>
    </div>
  )

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <div className="relative w-full h-48 overflow-hidden">
        <img src={bg2} alt="background" className="w-full h-full object-cover rounded-2xl" />
        <div className="absolute inset-0 " />
        <div className="absolute bottom-5 left-8">
          <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
            Bill Archive
          </h1>
          <p className="text-lg text-gray-500 mt-1">Upload and manage your energy bill images</p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-8 pb-10 mt-4">

        {/* ── Error Banner ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">{images.length} {images.length === 1 ? 'bill' : 'bills'} stored</p>
            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <LayoutGrid size={15} />
              </button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <List size={15} />
              </button>
            </div>
          </div>

          {/* Upload */}
          <label className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${uploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'}`}>
            {uploading ? <><Loader2 size={16} className="animate-spin" />Uploading...</> : <><Upload size={16} />Upload Bill</>}
            <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
          </label>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 size={36} className="animate-spin mb-3" />
            <p className="text-sm">Loading bills...</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <FileImage size={48} className="mb-4 text-gray-300" />
            <p className="text-base font-medium text-gray-500">No bills uploaded yet</p>
            <p className="text-sm mt-1">Click "Upload Bill" to add your first image</p>
          </div>
        )}

        {/* ── Grid View ── */}
        {!loading && images.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {images.map((doc) => (
              <div key={doc.$id} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative w-full h-44 cursor-pointer overflow-hidden bg-gray-50" onClick={() => setLightbox(doc)}>
                  <img src={getImagePreviewUrl(doc.fileId)} alt={doc.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 truncate" title={doc.name}>{doc.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-2">{formatDate(doc.uploadedAt)}</p>
                  <CardActions doc={doc} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── List View ── */}
        {!loading && images.length > 0 && view === 'list' && (
          <div className="flex flex-col gap-2">
            {images.map((doc) => (
              <div key={doc.$id} className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-4 py-3 hover:shadow-sm transition-shadow">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 cursor-pointer" onClick={() => setLightbox(doc)}>
                  <img src={getImagePreviewUrl(doc.fileId)} alt={doc.name} className="w-full h-full object-cover" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(doc.uploadedAt)}</p>
                </div>
                {/* Actions */}
                <CardActions doc={doc} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">{lightbox.name}</p>
                <p className="text-xs text-gray-400">{formatDate(lightbox.uploadedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDelete(lightbox)} disabled={deletingId === lightbox.$id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors">
                  {deletingId === lightbox.$id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  Delete
                </button>
                <button onClick={() => setLightbox(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="max-h-[80vh] overflow-auto bg-gray-50 flex items-center justify-center p-4">
              <img src={getImagePreviewUrl(lightbox.fileId)} alt={lightbox.name} className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillArchive