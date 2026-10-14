import 'package:flutter/material.dart';

void main() {
  runApp(const MfgosMobileApp());
}

class MfgosMobileApp extends StatelessWidget {
  const MfgosMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MFGOS Factory Terminal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF38BDF8),
          secondary: Color(0xFF818CF8),
          surface: Color(0xFF0F172A),
          error: Color(0xFFF43F5E),
        ),
        scaffoldBackgroundColor: const Color(0xFF090D16),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0F172A),
          elevation: 0,
          centerTitle: false,
        ),
      ),
      home: const FactoryTerminalScreen(),
    );
  }
}

class FactoryTerminalScreen extends StatefulWidget {
  const FactoryTerminalScreen({super.key});

  @override
  State<FactoryTerminalScreen> createState() => _FactoryTerminalScreenState();
}

class _FactoryTerminalScreenState extends State<FactoryTerminalScreen> {
  bool isOnline = true;
  int completedCount = 96;
  int rejectedCount = 4;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFF0284C7),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.precision_manufacturing, size: 20, color: Colors.white),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'MFGOS Mobile',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Text(
                  'Shop-Floor Terminal • PLT-01',
                  style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              isOnline ? Icons.cloud_done : Icons.cloud_off,
              color: isOnline ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
            ),
            tooltip: isOnline ? 'Connected to Supabase' : 'Offline Mode (Drift SQLite Active)',
            onPressed: () {
              setState(() {
                isOnline = !isOnline;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    isOnline 
                      ? 'Reconnected: Background Sync Manager active.' 
                      : 'Offline Simulation: Operations queued in local SQLite.',
                  ),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sync & Terminal Banner
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isOnline ? const Color(0x1A10B981) : const Color(0x1AF59E0B),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isOnline ? const Color(0x4010B981) : const Color(0x40F59E0B),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    isOnline ? Icons.check_circle_outline : Icons.offline_bolt,
                    size: 18,
                    color: isOnline ? const Color(0xFF34D399) : const Color(0xFFFBBF24),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      isOnline
                          ? 'Online • Synced with Apex Precision Cloud'
                          : 'Offline Engine • Queuing changes in Drift SQLite',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isOnline ? const Color(0xFF34D399) : const Color(0xFFFBBF24),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Assigned Job Traveler Card
            const Text(
              'ACTIVE ASSIGNED OPERATION',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.8,
                color: Color(0xFF64748B),
              ),
            ),
            const SizedBox(height: 10),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0x20FFFFFF)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0x2038BDF8),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0x4038BDF8)),
                        ),
                        child: const Text(
                          'PO-2026-001',
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF38BDF8),
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0x20A855F7),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'STAGE 02: CNC Turning',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFFC084FC)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Industrial Helical Gear (Module 4, 32T)',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Work Center: WC-CNC-01 (Haas ST-30Y Turning Center)',
                    style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                  ),
                  const Divider(color: Color(0x1AFFFFFF), height: 24),

                  // Counts
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildMetricColumn('Planned', '100 pcs', Colors.white),
                      _buildMetricColumn('Accepted', '$completedCount pcs', const Color(0xFF34D399)),
                      _buildMetricColumn('Scrap Defect', '$rejectedCount pcs', const Color(0xFFFB7185)),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0284C7),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: const Icon(Icons.qr_code_scanner, size: 18),
                          label: const Text('Scan Lot QR'),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Lot barcode verified: HEAT-9843-A')),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF059669),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: const Icon(Icons.check, size: 18),
                          label: const Text('Complete Step'),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Operation completed! Gating to CMM Inspection.')),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Configurable Routing Stepper Preview
            const Text(
              'ROUTING PIPELINE (CONFIGURABLE FSM)',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.8,
                color: Color(0xFF64748B),
              ),
            ),
            const SizedBox(height: 10),

            _buildStageTile('1. Material Staging & Bar Sawing', 'Warehouse Team', true, false),
            _buildStageTile('2. CNC Turning & Face Grooving', 'You (Operator)', true, false),
            _buildStageTile('3. Gear Teeth Hobbing', 'Operator Team', false, false),
            _buildStageTile('4. CMM Quality Gate Signoff', 'Quality Inspector', false, true),
            _buildStageTile('5. Finished Goods Stock Transfer', 'Warehouse Team', false, false),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricColumn(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color, fontFamily: 'monospace'),
        ),
      ],
    );
  }

  Widget _buildStageTile(String title, String role, bool done, bool isQc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: done ? const Color(0x3038BDF8) : const Color(0x1AFFFFFF)),
      ),
      child: Row(
        children: [
          Icon(
            done ? Icons.check_circle : Icons.radio_button_unchecked,
            size: 18,
            color: done ? const Color(0xFF38BDF8) : const Color(0xFF64748B),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: done ? FontWeight.bold : FontWeight.normal,
                color: done ? Colors.white : const Color(0xFF94A3B8),
              ),
            ),
          ),
          if (isQc)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0x20A855F7),
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Text('QC Gate', style: TextStyle(fontSize: 10, color: Color(0xFFC084FC))),
            ),
        ],
      ),
    );
  }
}
