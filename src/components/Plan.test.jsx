import { describe, expect, } from "vitest";
import Plan from "./Plan";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("Plan", () => {
  const domainValue = "(define (domain gripper-strips)(:requirements :strips)(:predicates (room ?r)(ball ?b)(gripper ?g)(at-robby ?r)(at ?b ?r)(free ?g)(carry ?o ?g))(:action move:parameters  (?from ?to):precondition (and  (room ?from) (room ?to) (at-robby ?from)):effect (and  (at-robby ?to)(not (at-robby ?from))))(:action pick:parameters (?obj ?room ?gripper):precondition  (and  (ball ?obj) (room ?room) (gripper ?gripper)(at ?obj ?room) (at-robby ?room) (free ?gripper)):effect (and (carry ?obj ?gripper)(not (at ?obj ?room)) (not (free ?gripper))))(:action drop:parameters  (?obj  ?room ?gripper):precondition  (and  (ball ?obj) (room ?room) (gripper ?gripper)(carry ?obj ?gripper) (at-robby ?room)):effect (and (at ?obj ?room)(free ?gripper)(not (carry ?obj ?gripper)))))";
  const problemValue = "(define (problem strips-gripper-x-1)(:domain gripper-strips)(:objects rooma roomb ball4 ball3 ball2 ball1 left right)(:init (room rooma)(room roomb)(ball ball4)(ball ball3)(ball ball2)(ball ball1)(at-robby rooma)(free left)(free right)(at ball4 rooma)(at ball3 rooma)(at ball2 rooma)(at ball1 rooma)(gripper left)(gripper right))(:goal (and (at ball4 roomb)(at ball3 roomb)(at ball2 roomb)(at ball1 roomb))))";
  const actionA = "pick ball4 rooma left";
  const actionB = "pick ball4 rooma right";
    it('renders find plan button', () => {
      render(<Plan />);
      const findPlanButton = screen.getByTestId("find-plan");
      expect(findPlanButton).toHaveTextContent("Find Plan");
      expect(findPlanButton).toBeInTheDocument();
    });
    // it('find plan button finds plan with domain and problem files', () => {
    //   const handleFindPlan = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)} />);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   expect(handleFindPlan).toHaveBeenCalledWith(domainValue, problemValue);
    // });
    // it('renders loading spinner', () => {
    //   const handleFindPlan = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   const loading = screen.getByTestId("spinner");
    //   expect(loading).toBeInTheDocument();
    // });
    // it('renders plan title', async () => {
    //   const handleFindPlan = vi.fn().mockImplementationOnce(() => "No Plan");
    //   render(<Plan domainValue={"a"} problemValue={"a"} handleFindPlan={handleFindPlan(domainValue, problemValue)}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   await handleFindPlan(() => {
    //     const planTitle = screen.queryByTestId("plan-title");
    //     expect(planTitle).toBeInTheDocument(); 
    //   });
    // });
    // it('renders original plan', async () => {
    //   const handleFindPlan = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   await handleFindPlan(() => {
    //     const originalPlan = screen.queryByTestId("original-plan");
    //     expect(originalPlan).toBeInTheDocument(); 
    //     const plan = screen.queryByTestId("plan");
    //     expect(plan).toBeInTheDocument(); 
    //   });
    // });
    // it('renders reset button', async () => {
    //   const handleFindPlan = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   await handleFindPlan(() => {
    //     const resetButton = screen.queryByTestId("reset");
    //     expect(resetButton).toBeInTheDocument(); 
    //   });
    // });
    // it('reset button resets everything', async () => {
    //   const handleFindPlan = vi.fn();
    //   const handleReset = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)} reset={handleReset("")}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   await handleFindPlan(() => {
    //     const resetButton = screen.queryByTestId("reset");
    //     expect(resetButton).toBeInTheDocument(); 
    //     fireEvent.click(resetButton);
    //     expect(handleReset).toHaveBeenCalled();
    //   });
    // });
    // it('renders button1', async () => {
    //   const handleFindPlan = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   await handleFindPlan(() => {
    //     const button1 = screen.queryByTestId("button1");
    //     expect(button1).toBeInTheDocument(); 
    //   });
    // });
    // it('button1 generates new plan with actionA and actionB', async () => {
    //   const handleFindPlan = vi.fn();
    //   const handleButton1 = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)} handleButton1={handleButton1(actionA, actionB)}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   await handleFindPlan(() => {
    //     const button1 = screen.queryByTestId("button1");
    //     fireEvent.click(button1);
    //     expect(handleButton1).toHaveBeenCalledWith(actionA, actionB);
    //   });
    // });
    // it('renders button2', async () => {
    //   const handleFindPlan = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   await handleFindPlan(() => {
    //     const button2 = screen.queryByTestId("button2");
    //     expect(button2).toBeInTheDocument(); 
    //   });
    // });
    // it('button2 generates new plan with actionA and actionB', async () => {
    //   const handleFindPlan = vi.fn();
    //   const handleButton2 = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)} handleButton2={handleButton2(actionA, actionB)}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   await handleFindPlan(() => {
    //     const button2 = screen.queryByTestId("button2");
    //     fireEvent.click(button2);
    //     expect(handleButton2).toHaveBeenCalledWith(actionA, actionB);
    //   });      
    // });
    // it('new plan generates graphs and chart', async () => {
    //   const handleFindPlan = vi.fn();
    //   const handleButton1 = vi.fn();
    //   const handleButton2 = vi.fn();
    //   render(<Plan domainValue={domainValue} problemValue={problemValue} handleFindPlan={handleFindPlan(domainValue, problemValue)} handleButton1={handleButton2(actionA, actionB)} handleButton2={handleButton2(actionA, actionB)}/>);
    //   const findPlanButton = screen.getByTestId("find-plan");
    //   fireEvent.click(findPlanButton);
    //   await handleFindPlan(() => {
    //     const button1 = screen.queryByTestId("button1");
    //     fireEvent.click(button1);
    //     expect(handleButton1).toHaveBeenCalledWith(actionA, actionB);
    //     const graph = screen.queryByTestId("graph-viewer");
    //     expect(graph).toBeInTheDocument(); 
    //   });    
    //   await handleFindPlan(() => {
    //     const button2 = screen.queryByTestId("button2");
    //     fireEvent.click(button2);
    //     expect(handleButton2).toHaveBeenCalledWith(actionA, actionB);
    //     const chart = screen.queryByTestId("chart-viewer");
    //     expect(chart).toBeInTheDocument(); 
    //   });      
    // });
});