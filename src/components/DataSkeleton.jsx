import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const DataSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-1">
            <Skeleton className={"h-4 w-32 bg-gray-200"} /> {/*Username */}
            <Skeleton className={"h-3 w-20 bg-gray-200"} /> {/*Time badge */}
          </div>
          <Skeleton className={"h-8 w-8 rounded-full bg-gray-200"} />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Skeleton className={"h-8 w-48 mb-3 rounded-full bg-gray-200"} />
        <Skeleton className={"h-16 w-full mb-3 rounded-full bg-gray-200"} />
      </CardContent>

      <CardFooter>
        <Skeleton className={"h-8 w-8 rounded-lg bg-gray-200"} />
      </CardFooter>
    </Card>
  );
};

export default DataSkeleton;
