"use client";


import Loading from "@/components/loading";
import React, { Suspense, type FC } from "react";


interface Props {
    children: React.ReactNode;
}

const SiteLayout: FC<Props> = ({ children }) => {


    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <main>{children}</main>
            </div>
        </Suspense>
    );
};

export default SiteLayout;
