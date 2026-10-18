import { useParams } from 'react-router-dom'

export default function BlogDetalle() {
  const { slug } = useParams<{ slug: string }>()
  return (
    <div className="container py-5">
      <h1 className="section-title">Detalle de Noticia</h1>
      <p className="text-muted">Slug: {slug}</p>
    </div>
  )
}
