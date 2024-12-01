import React from 'react';
import { UserCircle } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  color: string;
}

interface MembersListProps {
  members: Member[];
}

const MembersList: React.FC<MembersListProps> = ({ members }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Members</h2>
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center`}>
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <span>{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;

