import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  type Node,
  type Edge,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useTranslation } from '@/shared/lib/i18n';
import { useIsMobile } from '@/shared/hooks';

import { FlowNode } from './FlowNode';
import { RowLabel } from './RowLabel';

const DANGER = '#ef4444';
const DANGER_DIM = '#f87171';
const SAFE = '#3B9BF5';
const SAFE_ALT = '#22c55e';

export function VpnFlowDiagram() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const nodeTypes = useMemo(() => ({ flowNode: FlowNode, rowLabel: RowLabel }), []);

  const nodes: Node[] = useMemo(() => {
    const gap = isMobile ? 140 : 210;
    const row1Y = 20;
    const row2Y = isMobile ? 150 : 170;

    if (isMobile) {
      return [
        // ── Row 1: Without VPN (no label on mobile, tighter) ──
        {
          id: 'label-no-vpn',
          type: 'rowLabel',
          position: { x: 0, y: row1Y + 15 },
          data: { label: t('flow.noVpnLabel'), variant: 'danger' },
          draggable: false,
          selectable: false,
        },
        {
          id: 'no-device',
          type: 'flowNode',
          position: { x: 90, y: row1Y },
          data: { label: t('flow.noDevice'), description: t('flow.noDeviceDesc'), icon: 'smartphone', variant: 'default' as const },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'no-request',
          type: 'flowNode',
          position: { x: 90 + gap, y: row1Y },
          data: { label: t('flow.noRequest'), description: t('flow.noRequestDesc'), icon: 'lockOpen', variant: 'default' as const },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'no-isp',
          type: 'flowNode',
          position: { x: 90 + gap * 2, y: row1Y },
          data: { label: t('flow.noIsp'), description: t('flow.noIspDesc'), icon: 'eye', variant: 'blocked' as const },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'no-blocked',
          type: 'flowNode',
          position: { x: 90 + gap * 3, y: row1Y },
          data: { label: t('flow.noBlocked'), description: t('flow.noBlockedDesc'), icon: 'ban', variant: 'blocked' as const },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },

        // ── Row 2: With VPN ──
        {
          id: 'label-vpn',
          type: 'rowLabel',
          position: { x: 0, y: row2Y + 15 },
          data: { label: t('flow.vpnLabel'), variant: 'safe' },
          draggable: false,
          selectable: false,
        },
        {
          id: 'vpn-device',
          type: 'flowNode',
          position: { x: 90, y: row2Y },
          data: { label: t('flow.vpnDevice'), description: t('flow.vpnDeviceDesc'), icon: 'smartphone', variant: 'default' as const },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'vpn-encrypt',
          type: 'flowNode',
          position: { x: 90 + gap, y: row2Y },
          data: { label: t('flow.vpnEncrypt'), description: t('flow.vpnEncryptDesc'), icon: 'lock', variant: 'primary' as const },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'vpn-isp',
          type: 'flowNode',
          position: { x: 90 + gap * 2, y: row2Y },
          data: { label: t('flow.vpnIsp'), description: t('flow.vpnIspDesc'), icon: 'shieldCheck', variant: 'success' as const },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'vpn-server',
          type: 'flowNode',
          position: { x: 90 + gap * 3, y: row2Y },
          data: { label: t('flow.vpnServer'), description: t('flow.vpnServerDesc'), icon: 'server', variant: 'primary' as const },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'vpn-internet',
          type: 'flowNode',
          position: { x: 90 + gap * 4, y: row2Y },
          data: { label: t('flow.vpnInternet'), description: t('flow.vpnInternetDesc'), icon: 'globe', variant: 'success' as const },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
      ];
    }

    // Desktop layout
    const labelW = 120;
    const startX = labelW + 30;

    return [
      // ── Row 1: Without VPN ──
      {
        id: 'label-no-vpn',
        type: 'rowLabel',
        position: { x: 0, y: row1Y + 20 },
        data: { label: t('flow.noVpnLabel'), variant: 'danger' },
        draggable: false,
        selectable: false,
      },
      {
        id: 'no-device',
        type: 'flowNode',
        position: { x: startX, y: row1Y },
        data: { label: t('flow.noDevice'), description: t('flow.noDeviceDesc'), icon: 'smartphone', variant: 'default' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: 'no-request',
        type: 'flowNode',
        position: { x: startX + gap, y: row1Y },
        data: { label: t('flow.noRequest'), description: t('flow.noRequestDesc'), icon: 'lockOpen', variant: 'default' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: 'no-isp',
        type: 'flowNode',
        position: { x: startX + gap * 2, y: row1Y },
        data: { label: t('flow.noIsp'), description: t('flow.noIspDesc'), icon: 'eye', variant: 'blocked' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: 'no-blocked',
        type: 'flowNode',
        position: { x: startX + gap * 3, y: row1Y },
        data: { label: t('flow.noBlocked'), description: t('flow.noBlockedDesc'), icon: 'ban', variant: 'blocked' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },

      // ── Row 2: With VPN ──
      {
        id: 'label-vpn',
        type: 'rowLabel',
        position: { x: 0, y: row2Y + 25 },
        data: { label: t('flow.vpnLabel'), variant: 'safe' },
        draggable: false,
        selectable: false,
      },
      {
        id: 'vpn-device',
        type: 'flowNode',
        position: { x: startX, y: row2Y },
        data: { label: t('flow.vpnDevice'), description: t('flow.vpnDeviceDesc'), icon: 'smartphone', variant: 'default' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: 'vpn-encrypt',
        type: 'flowNode',
        position: { x: startX + gap, y: row2Y },
        data: { label: t('flow.vpnEncrypt'), description: t('flow.vpnEncryptDesc'), icon: 'lock', variant: 'primary' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: 'vpn-isp',
        type: 'flowNode',
        position: { x: startX + gap * 2, y: row2Y },
        data: { label: t('flow.vpnIsp'), description: t('flow.vpnIspDesc'), icon: 'shieldCheck', variant: 'success' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: 'vpn-server',
        type: 'flowNode',
        position: { x: startX + gap * 3, y: row2Y },
        data: { label: t('flow.vpnServer'), description: t('flow.vpnServerDesc'), icon: 'server', variant: 'primary' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: 'vpn-internet',
        type: 'flowNode',
        position: { x: startX + gap * 4, y: row2Y },
        data: { label: t('flow.vpnInternet'), description: t('flow.vpnInternetDesc'), icon: 'globe', variant: 'success' as const },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
    ];
  }, [t, isMobile]);

  const edges: Edge[] = useMemo(
    () => [
      // Row 1 edges (danger — red, static dashed)
      {
        id: 'no-device-request',
        source: 'no-device',
        target: 'no-request',
        style: { stroke: DANGER_DIM, strokeWidth: 1.5, strokeDasharray: '6 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: DANGER_DIM, width: 14, height: 14 },
      },
      {
        id: 'no-request-isp',
        source: 'no-request',
        target: 'no-isp',
        style: { stroke: DANGER, strokeWidth: 2, strokeDasharray: '6 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: DANGER, width: 14, height: 14 },
      },
      {
        id: 'no-isp-blocked',
        source: 'no-isp',
        target: 'no-blocked',
        style: { stroke: DANGER, strokeWidth: 2, strokeDasharray: '6 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: DANGER, width: 14, height: 14 },
      },

      // Row 2 edges (safe — blue/green, animated)
      {
        id: 'vpn-device-encrypt',
        source: 'vpn-device',
        target: 'vpn-encrypt',
        animated: true,
        style: { stroke: SAFE, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: SAFE, width: 14, height: 14 },
      },
      {
        id: 'vpn-encrypt-isp',
        source: 'vpn-encrypt',
        target: 'vpn-isp',
        animated: true,
        style: { stroke: SAFE, strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: SAFE, width: 14, height: 14 },
      },
      {
        id: 'vpn-isp-server',
        source: 'vpn-isp',
        target: 'vpn-server',
        animated: true,
        style: { stroke: SAFE_ALT, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: SAFE_ALT, width: 14, height: 14 },
      },
      {
        id: 'vpn-server-internet',
        source: 'vpn-server',
        target: 'vpn-internet',
        animated: true,
        style: { stroke: SAFE_ALT, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: SAFE_ALT, width: 14, height: 14 },
      },
    ],
    [t],
  );

  const onInit = useCallback((instance: { fitView: () => void }) => {
    setTimeout(() => instance.fitView(), 100);
  }, []);

  return (
    <div className="h-[280px] w-full md:h-[380px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: isMobile ? 0.08 : 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={isMobile}
        panOnScroll={isMobile}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        minZoom={0.4}
        maxZoom={1}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}
