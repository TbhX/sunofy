export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div className='p-8'>Artist {id}</div>
}
