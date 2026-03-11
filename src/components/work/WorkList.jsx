"use client";

import ItemList from "@/components/common/ItemList";
import { allProjects } from "@/constants/work";

export default function WorkList() {
  return <ItemList items={allProjects} label="Work" />;
}
