'use client'

import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface TableUIProps {
    tableCaption: string;
    headCaption: string[];
    cellDatas: string[][];
}

const TableUI: React.FC<TableUIProps> = ({ tableCaption, headCaption, cellDatas }) => {

    return (
        <Table className="border-2">
            <TableCaption className="text-xl text-bold mb-4" style={{ captionSide: 'top' }}>{tableCaption}</TableCaption>
            <TableHeader className="border border-y-2">
                <TableRow className={undefined}>
                    { headCaption.map((caption, index) => <TableHead key={index} className="border">{caption}</TableHead>) }
                </TableRow>
            </TableHeader>
            { cellDatas.map((cellData, index) => (
                <TableBody key={index} className="border border-y-gray-300">
                    <TableRow className={undefined}>
                        { cellData.map((data, index) => <TableCell key={index} className="border border-x-1 border-y-0">{data}</TableCell>) }
                    </TableRow>
                </TableBody>
            )) }
        </Table>
    );
  }
  
  export default TableUI;