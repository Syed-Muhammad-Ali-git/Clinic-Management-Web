'use client';

import React from 'react';
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold">Unauthorized</h2>
        <p className="mt-2">You don't have access to this page.</p>
        <div className="mt-4">
          <Link href="/">Go home</Link>
        </div>
      </div>
    </div>
  );
}
