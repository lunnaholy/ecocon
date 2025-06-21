import { Briefcase, CheckCircle2, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function Tabs() {
  const tabsList = [
    {
      name: "Tasks",
      link: "/",
      icon: Home
    },
    {
      name: "My Jobs",
      link: "/jobs",
      icon: Briefcase
    },
    {
      name: "Check",
      link: "/checks",
      icon: CheckCircle2
    }
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (link: string) => {
    return location.pathname === link;
  }

  return (
    <div className='fixed bottom-0 pb-8 left-0 right-0 bg-background'>
      <div className='flex flex-row w-full h-16'>
        {tabsList.map((tab, index) => (
          <div 
            className={`cursor-pointer w-full flex flex-col gap-1 items-center justify-center ${isActive(tab.link) ? "text-primary" : "text-gray-500"}`} 
            key={index}
            onClick={() => navigate(tab.link)}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-sm">{tab.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}