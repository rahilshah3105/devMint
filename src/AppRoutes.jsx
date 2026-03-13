import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import CodeFormatter from './pages/CodeFormatter';
import MultiLangEditor from './pages/MultiLangEditor';
import DiffChecker from './pages/DiffChecker';
import CodeShrinker from './pages/CodeShrinker';

import JsonToTypes from './pages/JsonToTypes';
import JsonToolkit from './pages/JsonToolkit';
import Base64Converter from './pages/Base64Converter';
import UrlConverter from './pages/UrlConverter';
import JwtDecoder from './pages/JwtDecoder';

import JSRunner from './pages/JSRunner';
import RegexTester from './pages/RegexTester';
import HashGenerator from './pages/HashGenerator';
import RemoteRunner from './pages/RemoteRunner';

import ColorConverter from './pages/ColorConverter';
import UuidGenerator from './pages/UuidGenerator';
import LoremIpsum from './pages/LoremIpsum';
import TimestampConverter from './pages/TimestampConverter';
import DeveloperApps from './pages/DeveloperApps';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Redirect root to first tool */}
        <Route index element={<Navigate to="/formatter" replace />} />
        
        {/* Editors & Formatters */}
        <Route path="formatter" element={<CodeFormatter />} />
        <Route path="editor" element={<MultiLangEditor />} />
        <Route path="diff" element={<DiffChecker />} />
        <Route path="shrinker" element={<CodeShrinker />} />
        
        {/* Converters & Encoders */}
        <Route path="json-types" element={<JsonToTypes />} />
        <Route path="json-toolkit" element={<JsonToolkit />} />
        <Route path="base64" element={<Base64Converter />} />
        <Route path="url" element={<UrlConverter />} />
        <Route path="jwt" element={<JwtDecoder />} />
        <Route path="color" element={<ColorConverter />} />
        
        {/* Utilities */}
        <Route path="remote-runner" element={<RemoteRunner />} />
        <Route path="js-runner" element={<JSRunner />} />
        <Route path="regex" element={<RegexTester />} />
        <Route path="hash" element={<HashGenerator />} />
        <Route path="uuid" element={<UuidGenerator />} />
        <Route path="lorem" element={<LoremIpsum />} />
        <Route path="timestamp" element={<TimestampConverter />} />
        
        {/* Ecosystem */}
        <Route path="apps" element={<DeveloperApps />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/formatter" replace />} />
      </Route>
    </Routes>
  );
}
