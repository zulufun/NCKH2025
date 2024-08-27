import React from "react";
import { StatisticCard } from "@ant-design/pro-components";
import RcResizeObserver from "rc-resize-observer";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
const imgStyle = {
  display: "block",
  width: 42,
  height: 42,
};

interface Props {
  dataScore: any;
}

const ScoreCard: React.FC<Props> = ({ dataScore }) => {
  // const { total_collections, total_documents, max_collection, min_collection } = dataScore;
    const [responsive, setResponsive] = useState(false);
    const total= dataScore.total_collections
    const documents= dataScore.total_documents
    const max= dataScore.max_collection
    const min= dataScore.min_collection
    return (
        <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <StatisticCard.Group direction={responsive ? "column" : "row"}>
          <StatisticCard
            statistic={{
              title: "Số collection",
              value: total,
              icon: (
                <img
                  style={imgStyle}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM5iLBdLgNQg7rKzxbvGBd9i_1jL7XOGLBMbwSaQTKbvT1jocqgVGWFfv_HotRC60_Kec&usqp=CAU"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: "Tổng số access_logs",
              value: documents,
              icon: (
                <img
                  style={imgStyle}
                  src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: "Số logs cảnh báo",
              value: max,
              icon: (
                <img
                  style={imgStyle}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_bsoNP1VDathu7ajyKinKl4ZWy-DvQ_siqY623kR87A&s"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: "Số lần bị tấn công",
              value: min,
              icon: (
                <img
                  style={imgStyle}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnRg_eUuZFDnOJ9i2Oan2y5cJZPsnd1WFFuw&s"
                  alt="icon"
                />
              ),
            }}
          />
        </StatisticCard.Group>
      </RcResizeObserver>
    );
};
export default ScoreCard;
  

  
    

