"use client";

import ItemList from "@/components/common/ItemList";
import { recentWork } from "@/constants/home";

export default function WorkList() {
  return <ItemList items={recentWork} label="Work" />;
}
