import React, { useState } from 'react';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { BlogPost } from '@/types';

interface PostEditorProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({ post, onClose }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || '');
  const [tags, setTags] = useState(post?.tags.join(', ') || '');
  const [published, setPublished] = useState(post?.published || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Você precisa estar autenticado');
      return;
    }

    if (!currentUser.isAuthor && !currentUser.isAdmin) {
      setError('Você não tem permissão para criar posts');
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title,
        excerpt,
        content,
        imageUrl: imageUrl || null,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || 'Anônimo',
        authorPhotoURL: currentUser.photoURL || null,
        updatedAt: new Date(),
      };

      if (post) {
        // Update existing post
        await updateDoc(doc(db, 'posts', post.id), postData);
      } else {
        // Create new post
        await addDoc(collection(db, 'posts'), {
          ...postData,
          createdAt: new Date(),
        });
      }

      onClose();
    } catch (err: any) {
      console.error('Error saving post:', err);
      setError('Erro ao salvar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {post ? 'Editar Post' : 'Criar Novo Post'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Digite o título do post"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Resumo *
          </label>
          <textarea
            id="excerpt"
            required
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="input-field"
            placeholder="Um breve resumo do post (será exibido na listagem)"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Conteúdo *
          </label>
          <textarea
            id="content"
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-field"
            placeholder="Escreva o conteúdo completo do post"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL da Imagem (opcional)
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input-field"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (separadas por vírgula)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input-field"
            placeholder="saúde, corrida, bem-estar"
          />
        </div>

        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publicar imediatamente
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Salvando...' : post ? 'Atualizar Post' : 'Criar Post'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
