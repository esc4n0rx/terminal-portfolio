export default function WindowControls() {
  return (
    <div className="bg-gray-900 text-white p-1 px-3 flex justify-between items-center border-b border-gray-700">
      <div className="text-sm">Prompt de Comando</div>
      <div className="flex">
        <button className="px-2 hover:bg-gray-700">─</button>
        <button className="px-2 hover:bg-gray-700">□</button>
        <button className="px-2 hover:bg-gray-700">✕</button>
      </div>
    </div>
  )
}
