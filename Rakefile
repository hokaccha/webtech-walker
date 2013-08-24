REPOSITORY = 'hokaccha/webtech-walker'
MASTER_REPOSITORY = if ENV['GH_TOKEN']
    "https://#{ENV['GH_TOKEN']}@github.com/#{REPOSITORY}"
  else
    "git@github.com:#{REPOSITORY}.git"
  end
PUBLISH_BRANCH = 'gh-pages'
DEST_DIR = 'build'

def initialize_repository(repository, branch)
  require 'fileutils'

  if Dir["#{DEST_DIR}/.git"].empty?
    FileUtils.rm_rf DEST_DIR
    sh "git clone #{repository} #{DEST_DIR}"
  end

  Dir.chdir DEST_DIR do
    sh "git checkout --orphan #{branch}"
  end
end

def update_repository(branch)
  Dir.chdir DEST_DIR do
    sh 'git fetch origin'
    sh "git reset --hard origin/#{branch}"
    sh 'git clean -fd'
  end
end

def build
  sh 'bundle exec middleman build'
end

def push_to_gh_pages(repository, branch)
  sha1, _ = `git log -n 1 --oneline`.strip.split(' ')

  Dir.chdir DEST_DIR do
    sh 'git add -A'
    sh "git commit -m 'Update with #{sha1}'"
    sh "git push #{repository} #{branch}"
  end
end

desc 'Setup origin repository for GitHub pages'
task :setup do
  initialize_repository MASTER_REPOSITORY, PUBLISH_BRANCH
  update_repository PUBLISH_BRANCH
end

desc 'Clean built files'
task :clean do
  update_repository PUBLISH_BRANCH
end

desc 'Build sites'
task :build => ['clean'] do
  build
end

desc 'Publish website'
task :publish do
  push_to_gh_pages MASTER_REPOSITORY, PUBLISH_BRANCH
end
