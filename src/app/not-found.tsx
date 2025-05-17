export default function NotFound() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">잘못된 경로</h1>
        <p className="flex flex-col text-xl text-gray-600">
          <span>요청하신 페이지를 찾을 수 없습니다.</span>
          <span>페이지 상단의 다른 메뉴를 클릭하여 이동해 주세요.</span>
        </p>
      </div>
    </div>
  );
}
