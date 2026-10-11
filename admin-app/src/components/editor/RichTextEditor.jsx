import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { uploadService } from '../../services/uploadService';
import { useToast } from '../../context/ToastContext';
import {
  HiOutlineBold,
  HiOutlineItalic,
  HiOutlineUnderline,
  HiOutlineListBullet,
  HiOutlineNumberedList,
  HiOutlineLink,
  HiOutlinePhoto,
  HiOutlineTableCells,
  HiOutlineArrowUturnLeft,
  HiOutlineArrowUturnRight,
} from 'react-icons/hi2';

export default function RichTextEditor({ content = '', onChange, placeholder = 'Start writing your dynamic content here...' }) {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageAltInput, setImageAltInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amber-400 underline hover:text-amber-300 transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 shadow-md border border-slate-800',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4 border border-slate-800 rounded-lg overflow-hidden',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-800 bg-slate-900/80 p-2 text-left text-xs font-bold text-amber-400',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-800 p-2 text-xs text-slate-300',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'min-h-[280px] max-h-[550px] overflow-y-auto px-4 py-3 text-xs sm:text-sm text-slate-200 focus:outline-none leading-relaxed prose prose-invert max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  // Sync content when prop changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      if (editor.getText() === '' && content !== '') {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs">
        Loading editor...
      </div>
    );
  }

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL (e.g. https://... or /contact):', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadService.uploadFile(file);
      const fileUrl = res.data?.fileUrl;
      if (fileUrl) {
        editor.chain().focus().setImage({ src: fileUrl, alt: file.name }).run();
        toast.success('Image inserted into content.');
      }
    } catch (err) {
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setImageModalOpen(false);
    }
  };

  const handleInsertImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrlInput.trim(), alt: imageAltInput.trim() || 'Embedded Image' })
      .run();
    setImageUrlInput('');
    setImageAltInput('');
    setImageModalOpen(false);
  };

  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-950/60 overflow-hidden shadow-inner flex flex-col focus-within:border-gold-500/80 transition-colors">
      {/* Hidden file input for direct uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Toolbar */}
      <div className="p-2 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center gap-1">
        {/* Headings */}
        <select
          value={
            editor.isActive('heading', { level: 1 })
              ? 'h1'
              : editor.isActive('heading', { level: 2 })
              ? 'h2'
              : editor.isActive('heading', { level: 3 })
              ? 'h3'
              : 'p'
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
            else editor.chain().focus().setParagraph().run();
          }}
          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-gold-500 cursor-pointer"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div className="w-[1px] h-5 bg-slate-800 mx-1" />

        {/* Basic formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive('bold')
              ? 'bg-gold-500 text-navy-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Bold (Ctrl+B)"
        >
          <HiOutlineBold className="text-sm" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive('italic')
              ? 'bg-gold-500 text-navy-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Italic (Ctrl+I)"
        >
          <HiOutlineItalic className="text-sm" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive('underline')
              ? 'bg-gold-500 text-navy-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Underline (Ctrl+U)"
        >
          <HiOutlineUnderline className="text-sm" />
        </button>

        <div className="w-[1px] h-5 bg-slate-800 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
            editor.isActive({ textAlign: 'left' })
              ? 'bg-slate-800 text-gold-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Align Left"
        >
          Left
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
            editor.isActive({ textAlign: 'center' })
              ? 'bg-slate-800 text-gold-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Align Center"
        >
          Center
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
            editor.isActive({ textAlign: 'right' })
              ? 'bg-slate-800 text-gold-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Align Right"
        >
          Right
        </button>

        <div className="w-[1px] h-5 bg-slate-800 mx-1" />

        {/* Lists & Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-gold-500 text-navy-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Bullet List"
        >
          <HiOutlineListBullet className="text-sm" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-gold-500 text-navy-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Numbered List"
        >
          <HiOutlineNumberedList className="text-sm" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-gold-500 text-navy-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Blockquote"
        >
          Quote
        </button>

        <div className="w-[1px] h-5 bg-slate-800 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={handleSetLink}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            editor.isActive('link')
              ? 'bg-gold-500 text-navy-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Insert Link"
        >
          <HiOutlineLink className="text-sm" />
        </button>

        {/* Image insertion */}
        <button
          type="button"
          onClick={() => setImageModalOpen(true)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Insert / Upload Image"
        >
          <HiOutlinePhoto className="text-sm text-gold-400" />
          <span>Image</span>
        </button>

        {/* Table actions */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Insert 3x3 Table"
        >
          <HiOutlineTableCells className="text-sm text-gold-400" />
          <span>Table</span>
        </button>

        {editor.isActive('table') && (
          <div className="flex items-center gap-1 pl-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded hover:text-white"
            >
              +Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded hover:text-white"
            >
              +Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-1.5 py-0.5 text-[10px] bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/30"
            >
              Delete Table
            </button>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg"
            title="Undo"
          >
            <HiOutlineArrowUturnLeft className="text-sm" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg"
            title="Redo"
          >
            <HiOutlineArrowUturnRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative flex-1 bg-slate-950/40">
        <EditorContent editor={editor} />
      </div>

      {/* Image Insertion Dialog */}
      {imageModalOpen && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow"
            >
              {uploadingImage ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload from Device</span>
              )}
            </button>
            <span className="text-[11px] text-slate-400">or enter URL:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:flex-1 max-w-md">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
            <input
              type="text"
              value={imageAltInput}
              onChange={(e) => setImageAltInput(e.target.value)}
              placeholder="Alt text"
              className="w-24 px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
            <button
              type="button"
              onClick={handleInsertImageUrl}
              className="px-3 py-1 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold rounded-lg"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => setImageModalOpen(false)}
              className="px-2 py-1 text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
