import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  pin: string;
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 'emp_0', name: 'Stephanie', role: 'Manager', pin: '5555' },
    { id: 'emp_1', name: 'Sarah Johnson', role: 'Designer', pin: '1111' },
    { id: 'emp_2', name: 'Dave Martinez', role: 'Print Tech', pin: '2222' },
    { id: 'emp_3', name: 'Mike Thompson', role: 'Installer', pin: '3333' },
    { id: 'emp_4', name: 'Chris Davis', role: 'Detailer', pin: '4444' },
    { id: 'emp_5', name: 'All-Pro Owner', role: 'Manager', pin: '0000' }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({ name: '', role: 'Installer', pin: '' });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const roles = ['Manager', 'Designer', 'Print Tech', 'Installer', 'Detailer'];

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.pin.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newMember.pin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }

    const member: TeamMember = {
      id: `emp_${Date.now()}`,
      name: newMember.name,
      role: newMember.role,
      pin: newMember.pin
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', role: 'Installer', pin: '' });
    setIsAdding(false);
    toast.success(`${member.name} added successfully!`);
  };

  const handleDeleteMember = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    if (window.confirm(`Delete ${member?.name}? This cannot be undone.`)) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
      toast.success(`${member?.name} removed`);
    }
  };

  const handleStartEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setEditingMember({ ...member });
  };

  const handleSaveEdit = () => {
    if (!editingMember) return;

    if (!editingMember.name.trim() || !editingMember.pin.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingMember.pin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }

    setTeamMembers(teamMembers.map(m => m.id === editingId ? editingMember : m));
    setEditingId(null);
    setEditingMember(null);
    toast.success('Team member updated!');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingMember(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <a href="/crm" className="hover:text-cyan-400 transition">
            <ArrowLeft className="w-6 h-6" />
          </a>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-pink-400" />
            <h1 className="text-3xl font-bold">Team Management</h1>
          </div>
        </div>

        {/* Add New Member Section */}
        {!isAdding ? (
          <Button
            onClick={() => setIsAdding(true)}
            className="mb-6 bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-700 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Team Member
          </Button>
        ) : (
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Add New Team Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., John Smith"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="pin">PIN (4+ digits)</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="e.g., 1234"
                  value={newMember.pin}
                  onChange={(e) => setNewMember({ ...newMember, pin: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddMember}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewMember({ name: '', role: 'Installer', pin: '' });
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Members List */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold mb-4">Current Team Members ({teamMembers.length})</h2>
          
          {teamMembers.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
              <p className="text-slate-400">No team members yet. Add one to get started!</p>
            </Card>
          ) : (
            teamMembers.map(member => (
              <Card
                key={member.id}
                className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition"
              >
                <CardContent className="p-4">
                  {editingId === member.id && editingMember ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`edit-name-${member.id}`}>Name</Label>
                          <Input
                            id={`edit-name-${member.id}`}
                            value={editingMember.name}
                            onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-role-${member.id}`}>Role</Label>
                          <select
                            id={`edit-role-${member.id}`}
                            value={editingMember.role}
                            onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                          >
                            {roles.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor={`edit-pin-${member.id}`}>PIN</Label>
                          <Input
                            id={`edit-pin-${member.id}`}
                            type="password"
                            value={editingMember.pin}
                            onChange={(e) => setEditingMember({ ...editingMember, pin: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{member.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-slate-700 border-slate-600">
                            {member.role}
                          </Badge>
                          <span className="text-sm text-slate-400">PIN: {member.pin}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStartEdit(member)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteMember(member.id)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Box */}
        <Card className="mt-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-base">💡 Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300 space-y-2">
            <p>• Use 4-digit PINs for easy team member login</p>
            <p>• Each team member gets full access to the CRM after login</p>
            <p>• Edit or delete team members anytime</p>
            <p>• Keep PINs simple but unique for each person</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
