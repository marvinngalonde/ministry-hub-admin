import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage application settings and preferences</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="site-title">Site Title</Label>
            <Input
              id="site-title"
              placeholder="The Final Conflict Ministry"
              defaultValue="The Final Conflict Ministry"
            />
            <p className="text-sm text-muted-foreground mt-1">
              This title appears in the browser tab and header
            </p>
          </div>

          <div>
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              placeholder="A ministry dedicated to..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="contact@ministry.org"
            />
          </div>

          <div>
            <Label htmlFor="support-email">Support Email</Label>
            <Input
              id="support-email"
              type="email"
              placeholder="support@ministry.org"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Content Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-publish Sermons</Label>
              <p className="text-sm text-muted-foreground">
                Automatically publish sermons after upload
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Moderate Community Posts</Label>
              <p className="text-sm text-muted-foreground">
                Require approval before posts are visible
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Comments</Label>
              <p className="text-sm text-muted-foreground">
                Enable comments on content
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Storage Settings</h2>
        <div className="space-y-4">
          <div>
            <Label>Maximum Video Upload Size</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input type="number" defaultValue="2048" className="w-32" />
              <span className="text-sm text-muted-foreground">MB</span>
            </div>
          </div>

          <div>
            <Label>Maximum Image Upload Size</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input type="number" defaultValue="5" className="w-32" />
              <span className="text-sm text-muted-foreground">MB</span>
            </div>
          </div>

          <div>
            <Label>Maximum Document Upload Size</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input type="number" defaultValue="50" className="w-32" />
              <span className="text-sm text-muted-foreground">MB</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications for new content
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New User Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Notify admins when new users register
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Community Post Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Notify moderators of new community posts
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
