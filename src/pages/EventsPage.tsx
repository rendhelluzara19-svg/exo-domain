import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Calendar as CalendarIcon, MapPin, Edit, Trash2, Plus, Loader2, X } from 'lucide-react';
import { AppEvent } from '@/types';
import { uploadToCloudinary } from '@/utils/cloudinary';
import cyberpunkBannerImg from '@/assets/images/cyberpunk_habitat_banner_1784072399682.jpg';

export const EventsPage = () => {
  const { events, currentUser, addEvent, updateEvent, deleteEvent } = useApp();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [tempMedia, setTempMedia] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const canManageEvents = currentUser?.role === 'ADMIN' || currentUser?.role === 'EVENT_ORGANIZER';

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setLocation('');
    setTempMedia([]);
    setEditingEvent(null);
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !location) return;
    
    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title,
        description: desc,
        location,
        mediaUrls: tempMedia
      });
      alert('Event Updated!');
      setIsCreateOpen(false);
    } else {
      addEvent({
        title,
        description: desc,
        location,
        mediaUrls: tempMedia
      });
      alert('Event Published!');
      setIsCreateOpen(false);
    }
    resetForm();
  };

  const openEdit = (ev: AppEvent) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setDesc(ev.description);
    setLocation(ev.location);
    setTempMedia(ev.mediaUrls || []);
    setIsCreateOpen(true);
  };

  const handleDelete = (id: string) => {
    setEventToDelete(id);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      setEventToDelete(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5" style={{ color: '#39FF14' }} />
          <h2 className="font-bold text-xl text-gray-900">Upcoming Events & Promos</h2>
        </div>
        {canManageEvents && (
          <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="w-4 h-4" /> Create Event
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-3xl border border-[#E5E7EB]">
            No upcoming events right now.
          </div>
        ) : (
          events.map(ev => (
            <div key={ev.id} className="bg-[#1a1c23] rounded-3xl overflow-hidden shadow-lg border border-gray-800 relative group hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] hover:border-[#39FF14]/30 transition-all duration-300">
              {ev.mediaUrls && ev.mediaUrls.length > 0 ? (
                <div className="w-full h-64 sm:h-80 bg-black flex items-center justify-center relative overflow-hidden">
                  {(ev.mediaUrls[0].match(/\.(mp4|webm|ogg)$/i) || ev.mediaUrls[0].includes('/video/upload/')) ? (
                    <video 
                      src={ev.mediaUrls[0]} 
                      className="w-full h-full object-cover" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <img 
                      src={ev.mediaUrls[0]} 
                      alt={ev.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  )}
                  <img src={cyberpunkBannerImg} alt="Fallback Banner" className="w-full h-full object-cover hidden" />
                </div>
              ) : (
                <div className="w-full h-64 sm:h-80 bg-black flex items-center justify-center relative overflow-hidden">
                  <img src={cyberpunkBannerImg} alt="Default Banner" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-2xl text-white mb-2">{ev.title}</h3>
                    <p className="text-gray-400 mb-4 whitespace-pre-line">{ev.description}</p>
                  </div>
                  {canManageEvents && (
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(ev)} className="p-2 text-teal-400 bg-teal-900/30 hover:bg-teal-900/60 rounded-full transition-colors" title="Edit Event">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ev.id)} className="p-2 text-red-400 bg-red-900/30 hover:bg-red-900/60 rounded-full transition-colors" title="Delete Event">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                  <span className="flex items-center gap-3"><CalendarIcon className="w-4 h-4" style={{ color: '#39FF14' }} /> {new Date(ev.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-3"><MapPin className="w-4 h-4" style={{ color: '#39FF14' }} /> {ev.location}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {canManageEvents && (
        <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title={editingEvent ? "Edit Event" : "Publish Event / Promo"}>
          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            <Input placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <Textarea placeholder="Event Description" value={desc} onChange={e => setDesc(e.target.value)} rows={3} required />
            <Input placeholder="Location / Coordinates" value={location} onChange={e => setLocation(e.target.value)} required />
            
            <div className="border border-[#E5E7EB] rounded-2xl p-4 bg-gray-50">
              <label className="block text-sm font-bold text-gray-700 mb-2">🖼️ Upload Event Photos or Video Teasers</label>
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple 
                disabled={isUploading}
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setIsUploading(true);
                    try {
                      const files = Array.from(e.target.files);
                      const urls = await Promise.all(files.map(uploadToCloudinary));
                      setTempMedia(prev => [...prev, ...urls]);
                    } catch (error) {
                      console.error("Upload error:", error);
                    } finally {
                      setIsUploading(false);
                    }
                  }
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-teal-600 hover:file:bg-gray-100 disabled:opacity-50"
              />
              {isUploading && (
                <div className="text-sm text-teal-600 mt-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloudinary...
                </div>
              )}
              {tempMedia.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {tempMedia.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 shrink-0">
                      {url.includes('/video/') || url.match(/\.(mp4|webm|ogg)$/i) ? (
                         <video src={url} className="w-full h-full object-cover rounded-xl border border-gray-200" muted playsInline />
                      ) : (
                         <img src={url} alt="Preview" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                      )}
                      <button 
                        type="button" 
                        onClick={() => setTempMedia(prev => prev.filter((_, index) => index !== i))} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                        title="Remove Media"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button type="submit" disabled={isUploading} className="w-full bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50">{editingEvent ? "Update Event" : "Publish to Global Feed"}</Button>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!eventToDelete} onClose={() => setEventToDelete(null)} title="Delete Event">
        <div className="space-y-6">
          <p className="text-gray-600 text-sm">Are you sure you want to delete this event? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setEventToDelete(null)}>Cancel</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
