import React from "react";
import { Card, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/affiliate/authAffiliateSlice";
import { RootState } from "../../app/store";
import { useGetAllQuotesByAffiliateIDQuery } from "features/affiliate/affiliateSlice";

interface WidgetsProps {
  id: number;
  name: string;
  amount: string;

  perstange: string;
  badgeColor: string;
  icon: string;
  iconColor: string;
}
const Widgets = () => {
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { data: AllAffiliateQuotes = [] } = useGetAllQuotesByAffiliateIDQuery(
    user?._id!
  );

  const acceptedJobs = AllAffiliateQuotes.filter(
    (quote: any) =>
      quote.progress === "Booked" ||
      quote.progress === "On Route" ||
      quote.progress === "On Site" ||
      quote.progress === "Picked Up"
  );

  const result = AllAffiliateQuotes.filter(
    (newJob: any) => newJob?.progress === "Completed"
  );

  const arrivageTotal = result.reduce(
    (sum, i) => (sum += Number(i.pushed_price)),
    0
  );

  const widgetsData: Array<WidgetsProps> = [
    {
      id: 1,
      name: "Accepted Jobs",
      amount: `${acceptedJobs.length}`,
      perstange: "+18.30",
      badgeColor: "success",
      icon: "bi bi-briefcase",
      iconColor: "secondary",
    },
    {
      id: 2,
      name: "Completed Jobs",
      amount: `${result.length}`,
      perstange: "-2.74",
      badgeColor: "danger",
      icon: "bi bi-check-lg",
      iconColor: "info",
    },
    {
      id: 3,
      name: "Total Income",
      amount: `£ ${arrivageTotal}`,
      perstange: "+29.08",
      badgeColor: "success",
      icon: "bi bi-currency-pound",
      iconColor: "warning",
    },
    // {
    //   id: 4,
    //   name: "ALL TRIPS",
    //   amount: "36758",
    //   perstange: "+1.67",
    //   badgeColor: "success",
    //   icon: "ph-sketch-logo",
    //   iconColor: "primary",
    // },
  ];
  return (
    <React.Fragment>
      {(widgetsData || []).map((item: any, key: number) => (
        <Col key={key}>
          <Card className="card-animate">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div
                  className={"vr rounded bg-" + item.iconColor + " opacity-50"}
                  style={{ width: "4px" }}
                ></div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-medium text-muted fs-14 text-truncate">
                    {item.name}
                  </p>
                  <h4 className="fs-22 fw-semibold mb-3">
                    {item.decimal ? "$" : ""}
                    <span className="counter-value" data-target="98851.35">
                      {item.amount}
                    </span>
                  </h4>
                  {/* <div className="d-flex align-items-center gap-2">
                                    <h5 className={"mb-0 badge bg-" + item.badgeColor + "-subtle text-" + item.badgeColor}>
                                        <i className={item.badgeColor === "success" ? "ri-arrow-right-up-line align-bottom" : "ri-arrow-right-down-line align-bottom"}></i> {item.perstange} %
                                    </h5>
                                    <p className="text-muted mb-0">than last week</p>
                                </div> */}
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span
                    className={
                      "avatar-title bg-" +
                      item.iconColor +
                      "-subtle text-" +
                      item.iconColor +
                      " rounded fs-3"
                    }
                  >
                    <i className={item.icon}></i>
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default Widgets;
