import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage application settings and preferences</p>
      </div>

      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">General Settings</h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="site-title" className="text-sm sm:text-base">Site Title</Label>
            <Input
              id="site-title"
              placeholder="The Final Conflict Ministry"
              defaultValue="The Final Conflict Ministry"
              className="w-full h-10 sm:h-11"
            />
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              This title appears in the browser tab and header
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="site-description" className="text-sm sm:text-base">Site Description</Label>
            <Textarea
              id="site-description"
              placeholder="A ministry dedicated to..."
              rows={3}
              className="w-full resize-none"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="contact-email" className="text-sm sm:text-base">Contact Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="contact@ministry.org"
              className="w-full h-10 sm:h-11"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="support-email" className="text-sm sm:text-base">Support Email</Label>
            <Input
              id="support-email"
              type="email"
              placeholder="support@ministry.org"
              className="w-full h-10 sm:h-11"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Content Settings</h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm sm:text-base">Auto-publish Sermons</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Automatically publish sermons after upload
              </p>
            </div>
            <Switch className="flex-shrink-0" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm sm:text-base">Moderate Community Posts</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Require approval before posts are visible
              </p>
            </div>
            <Switch defaultChecked className="flex-shrink-0" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm sm:text-base">Allow Comments</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enable comments on content
              </p>
            </div>
            <Switch defaultChecked className="flex-shrink-0" />
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Storage Settings</h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-sm sm:text-base">Maximum Video Upload Size</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input type="number" defaultValue="2048" className="w-24 sm:w-32 h-10 sm:h-11" />
              <span className="text-xs sm:text-sm text-muted-foreground">MB</span>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-sm sm:text-base">Maximum Image Upload Size</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input type="number" defaultValue="5" className="w-24 sm:w-32 h-10 sm:h-11" />
              <span className="text-xs sm:text-sm text-muted-foreground">MB</span>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-sm sm:text-base">Maximum Document Upload Size</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input type="number" defaultValue="50" className="w-24 sm:w-32 h-10 sm:h-11" />
              <span className="text-xs sm:text-sm text-muted-foreground">MB</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Notification Settings</h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm sm:text-base">Email Notifications</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Send email notifications for new content
              </p>
            </div>
            <Switch defaultChecked className="flex-shrink-0" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm sm:text-base">New User Notifications</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Notify admins when new users register
              </p>
            </div>
            <Switch defaultChecked className="flex-shrink-0" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 gap-3 sm:gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm sm:text-base">Community Post Notifications</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Notify moderators of new community posts
              </p>
            </div>
            <Switch className="flex-shrink-0" />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">Reset to Defaults</Button>
        <Button className="w-full sm:w-auto min-h-[44px]">Save Settings</Button>
      </div>
    </div>
  );
}
