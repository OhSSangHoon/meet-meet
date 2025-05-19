"use client";
import { useState } from "react";
import Image from "next/image";



export default function MyMeeting() {
    // state로 화면을 바꾼다 => 다른 방법을 써도 된다.
    const [selectedTabId, setSelectedTabId]= useState(0)
    return (
        <>
        {/* 나의 모임 & 나의 리뷰 ~ */}
        {/* 배경색을 흰색으로 만든다 */}
        <div className="bg-white border-t border-gray-500">
            <div className="flex gap-2">
                {/* 0 */}
                <div
                    onClick={() => setSelectedTabId(0)}
                 className={`${selectedTabId === 0 ? "border-b text-black" : "text-gray-500"}`}>
                    모든 리뷰 페이지
                </div>
                {/* 1 */}
                <div 
                onClick={() => setSelectedTabId(1)}
                className={`${selectedTabId === 1 ? " border-b text-black" : "text-gray-500"}`}>
                    나의 리뷰
                </div>
                {/* 2 */}
                <div 
                onClick={() => setSelectedTabId(2)}
                className={`${selectedTabId === 2 ? " border-b text-black" : "text-gray-500"}`}>
                    내가 만든 모임
                </div>
            </div>
            {/* 모임 목록  */}
            <div >
                {/* 모임1 */}
                <div className="flex border-b-2 border-dotted p-4">
                    <Image 
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lZXRpbmd8ZW58MHx8MHx8fDA%3D"
                        width={200}
                        height={150}
                        alt="모임 이미지"
                    />
                    <div>
                        <span>
                            이용 예정
                        </span>
                        <span>
                            개설 확정
                        </span>
                        <h3>달램핏 오피스 스트레칭 | <span>을지로 3가</span> </h3>
                        <span>
                            1월 7일 . 17:30
                        </span>
                        <span>
                            20/20
                        </span>

                        <button>예약 취소하기</button>
                    </div>
                </div> 
                {/* 모임2 */}
                <div className="flex border-b-2 border-dotted p-4">
                    <Image 
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lZXRpbmd8ZW58MHx8MHx8fDA%3D"
                        width={200}
                        height={150}
                        alt="모임 이미지"
                    />
                    <div>
                        <span>
                            이용 예정
                        </span>
                        <span>
                            개설 확정
                        </span>
                        <h3>달램핏 오피스 스트레칭 | <span>을지로 3가</span> </h3>
                        <span>
                            1월 7일 . 17:30
                        </span>
                        <span>
                            20/20
                        </span>

                        <button>예약 취소하기</button>
                    </div>
                </div> 
                {/* 모임3 */}
                <div className="flex border-b-2 border-dotted p-4">
                    <Image 
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lZXRpbmd8ZW58MHx8MHx8fDA%3D"
                        width={200}
                        height={150}
                        alt="모임 이미지"
                    />
                    <div>
                        <span>
                            이용 예정
                        </span>
                        <span>
                            개설 확정
                        </span>
                        <h3>달램핏 오피스 스트레칭 | <span>을지로 3가</span> </h3>
                        <span>
                            1월 7일 . 17:30
                        </span>
                        <span>
                            20/20
                        </span>

                        <button>예약 취소하기</button>
                    </div>
                </div> 
            </div>
        </div>
        </>

    )
}