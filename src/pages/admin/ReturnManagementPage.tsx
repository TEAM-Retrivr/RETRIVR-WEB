import React from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";

const ReturnManagementPage = () => {
  return (
    <Layout>
      <Header name="건국대학교 도서관자치위원회" pageName="반납 관리"></Header>
      <div className="flex flex-col font-[Pretendard] mt-6.5 mx-8 items-center gap-7.5">
        {/* 검색 영역 - 대여자 정보로 찾기 */}
        <div className="  w-84.5 h-11 flex items-center justify-between rounded-small border border-primary">
          <input
            className="flex-1  border-none outline-none pl-3 py-3 placeholder:text-neutral-gray-3 placeholder:text-14px "
            type="text"
            placeholder="대여자 정보로 찾기"
          ></input>
          <button type="submit" className="pr-3">
            <img src="/icons/search.svg" alt="검색" />
          </button>
        </div>
        {/* 반납 연체 확인 영역 - 가로로 스크롤 */}
        <div className="flex flex-col w-full">
          <p className="text-neutral-gray-1 text-16px font-bold">
            반납 연체 확인
          </p>
          <div className="flex mt-4"></div>
        </div>
        {/* 물품별 관리 영역 - 세로로 스크롤 */}
        <div className="flex flex-col w-full">
          <p className="text-neutral-gray-1 text-16px font-bold">물품별 관리</p>
          <p className="text-neutral-gray-3 text-12px mt-1.5 font-normal leading-[130%]">
            물품별 잔여 수량을 확인하고 반납 관리를 해보세요.
          </p>
          <div className="flex flex-col mt-4"></div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnManagementPage;
