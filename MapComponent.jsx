import React, { useEffect, useState } from "react";
import L from "leaflet";

const MapComponent = ({ facilities, onMarkerClick }) => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsKakaoLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY&autoload=false";
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => {
          setIsKakaoLoaded(true);
        });
      };
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!isKakaoLoaded || !facilities || facilities.length === 0) return;

    const { kakao } = window;
    const container = document.getElementById("map");
    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.613, 127.005),
      level: 5,
    });

    facilities.forEach((facility) => {
      const markerPosition = new kakao.maps.LatLng(facility.lat, facility.lng);

      
      const markerIcon = new kakao.maps.MarkerImage(
        facility.type === "병원" ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png" : "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
        new kakao.maps.Size(32, 32),
        new kakao.maps.Point(16, 32)
      );

      const mapMarker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerIcon,
      });

      kakao.maps.event.addListener(mapMarker, "click", () => {
        onMarkerClick(facility); // 클릭된 시설 정보를 부모에게 전달
      });

      mapMarker.setMap(map);

       // 상태가 "운영 중"이 아니면 X표 추가 (55번째 줄부터 74번째 줄 추가)
      if (facility.status !== "운영 중") {
        const overlayContent = `
          <div style="
            color: red;
            font-weight: bold;
            font-size: 20px;
            transform: translate(-50%, -100%);
          ">
            ❌
          </div>
        `;

        const overlay = new kakao.maps.CustomOverlay({
          position: markerPosition,
          content: overlayContent,
          yAnchor: 1,
        });

        overlay.setMap(map);
      }
    });
  }, [isKakaoLoaded, facilities, onMarkerClick]);

  if (!isKakaoLoaded) return <div>지도를 불러오는 중...</div>;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
  
      // 범례 추가 (병원, 대피소, 운영중이 아닌 상태 3가지로 나누어서 구분해서 표시)
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          zIndex: 10,
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        <strong>범례</strong>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
          <img src="https://maps.google.com/mapfiles/ms/icons/green-dot.png" alt="병원" width="20" />
          병원
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
          <img src="https://maps.google.com/mapfiles/ms/icons/orange-dot.png" alt="대피소" width="20" />
          대피소
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
          <span style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>❌</span>
          운영 중 아님
        </div>
      </div>
    </div>
  );
  
};

export default MapComponent; 
