export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div className='p-8'>Playlist {id}</div>
}
