/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ConnectGithub } from './pages/ConnectGithub';
import { Dashboard } from './pages/Dashboard';
import { FolioControl } from './pages/FolioControl';
import { Profile } from './pages/Profile';
import { PreviewEditor } from './pages/PreviewEditor';
import { Templates } from './pages/Templates';
import { Auth } from './pages/Auth';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/connect" element={<ConnectGithub />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/folio" element={<FolioControl />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/preview" element={<PreviewEditor />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
